import { UUID } from 'crypto';
import { User } from './User.js';
import { UserType } from '../../shared/types/SharedTypes.js';

export class Kitchen extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: UserType
    ) {
        super(_userId, _userName, _email , _password, _userType);
    }
}