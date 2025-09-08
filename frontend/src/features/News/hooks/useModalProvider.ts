import { createContext, useContext } from "react"
import type News from "../interfaces/News"

type Props = { 
    news?: News, 
    fn: (data: News) => Promise<News>, 
    msgs: {SuccessMsg: string, ErrorMsg: string}, 
    ButtonName: string
}

export const ModalContext = createContext<Props>({
  news: {
    _newsId: 0,
    _title: "",
    _description: "",
    _startDate: "",
    _endDate: ""
  },
  fn: async (data: News) => {
    return {
      _newsId: data._newsId ?? 0,
      _title: data._title ?? "",
      _description: data._description ?? "",
      _startDate: data._startDate ?? "",
      _endDate: data._endDate ?? ""
    }
  },
  msgs: { SuccessMsg: "", ErrorMsg: "" },
  ButtonName: ""
})

export const useModalProvider = () => useContext(ModalContext)
