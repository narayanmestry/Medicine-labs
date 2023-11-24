import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

type ContextProviderProps = {
    children: ReactNode;
  };

  interface IUpdateContext{
    setUpdate: Dispatch<SetStateAction<boolean>>;
    update: boolean;
  }

  const defaultValue = {} as IUpdateContext;

  export const UpdateQRContext = createContext(defaultValue);

  const UpdateContextProvider =({children} : ContextProviderProps)=>{
    const [update , setUpdate] = useState<boolean>(false)

    const contextValues={
        update,
        setUpdate
    }
    return(
        <UpdateQRContext.Provider value={contextValues}>
            {children}
        </UpdateQRContext.Provider>
    )
  }

  export default UpdateContextProvider