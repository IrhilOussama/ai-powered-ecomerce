
import { useState } from "react";
import Log_In_Page from "./log_in";
import Sign_Up_Page from "./sign_up";
export default function LoginPage() {
  const [login, setLogin] = useState(true);
    return (
      <>
        {login ? (
          <Log_In_Page setLogin={setLogin}/>
        ) : (
          <Sign_Up_Page setLogin={setLogin}/>
        )}
      </>
    )
}

