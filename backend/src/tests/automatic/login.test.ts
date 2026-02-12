// src/tests/automatic/login.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUseCase } from "../../application/use_cases/AuthUseCases/LogInUseCase.js";
import { User } from "../../domain/entities/User.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";

const mockUserRepo = {
  findByEmail: vi.fn(),
};

const mockJWTService = {
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
};

const mockHashService = {
  comparePasswords: vi.fn(),
};

const mockRefreshTokenRepository = {
  saveRefreshedToken: vi.fn(),
};

vi.mock("../../infrastructure/database/repository/UserRepository", () => ({
  UserRepository: class {
    findByEmail = mockUserRepo.findByEmail;
  },
}));

vi.mock("../../application/services/JWTService", () => ({
  JWTService: class {
    generateAccessToken = mockJWTService.generateAccessToken;
    generateRefreshToken = mockJWTService.generateRefreshToken;
  },
}));

vi.mock("../../application/services/PasswordHashing", () => ({
  PasswordHashingService: class {
    comparePasswords = mockHashService.comparePasswords;
  },
}));

vi.mock(
  "../../infrastructure/database/repository/RefreshTokenRepository",
  () => ({
    RefreshTokenRepository: class {
      saveRefreshedToken = mockRefreshTokenRepository.saveRefreshedToken;
    },
  }),
);

describe("Login Use Case", () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    loginUseCase = new LoginUseCase();
  });

  it("debería iniciar sesión exitosamente", async () => {
    let email = "prueba@gmail.com";
    let password = "password123";

    const existingUser = new User(
      "00000000-0000-0000-0000-000000000000",
      "Usuario de prueba",
      email,
      "hashedPassword",
      "Cliente",
    );

    const payload = {
      idUsuario: existingUser.userId,
      email: existingUser.email,
      tipoUsuario: existingUser.userType,
      username: existingUser.userName,
    };

    mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    mockHashService.comparePasswords.mockResolvedValue(true);
    mockJWTService.generateAccessToken.mockReturnValue("accessToken");
    mockJWTService.generateRefreshToken.mockReturnValue("refreshToken");
    mockRefreshTokenRepository.saveRefreshedToken.mockResolvedValue(undefined);

    const result = await loginUseCase.execute(email, password);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(mockHashService.comparePasswords).toHaveBeenCalledWith(
      password,
      existingUser.password,
    );
    expect(mockJWTService.generateAccessToken).toHaveBeenCalledWith(payload);
    expect(mockJWTService.generateRefreshToken).toHaveBeenCalledWith(payload);
    expect(mockRefreshTokenRepository.saveRefreshedToken).toHaveBeenCalledWith(
      existingUser.userId,
      "refreshToken",
      expect.any(Date),
    );
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      user: existingUser,
    });
  });

  it("debería lanzar un error si el usuario no existe", async () => {
    let email = "nonexistent@gmail.com";
    let password = "password123";

    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute(email, password)).rejects.toThrow(
      new UnauthorizedError("Email o contraseña incorrectos"),
    );
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
  });

  it("debería lanzar un error si la contraseña es incorrecta", async () => {
    let email = "prueba@gmail.com";
    let password = "wrongpassword";
    const existingUser = new User(
      "00000000-0000-0000-0000-000000000000",
      "Usuario de prueba",
      email,
      "hashedPassword",
      "Cliente",
    );

    mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    mockHashService.comparePasswords.mockResolvedValue(false);

    await expect(loginUseCase.execute(email, password)).rejects.toThrow(
      new UnauthorizedError("Email o contraseña incorrectos"),
    );

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(mockHashService.comparePasswords).toHaveBeenCalledWith(
      password,
      existingUser.password,
    );
  });
});
