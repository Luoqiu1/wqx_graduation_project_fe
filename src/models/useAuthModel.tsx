// import {useState, useCallback} from "react";
// import {checkUserLogin} from '@/services/user'
//
// export default function useAuthModel() {
//   const [user, setUser] = useState(null)
//
//   const signin = useCallback(async (user, password) => {
//     let checkUserInfo = await checkUserLogin({user: user, password: password})
//     setUser()
//   }, [])
//
//   const signout = useCallback(() => {
//     // signout implementation
//     // setUser(null)
//   }, [])
//
//   return {
//     user,
//     signin,
//     signout
//   }
// }
