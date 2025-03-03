import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const baseApi = import.meta.env.VITE_BASE_URL;

function SignIn() {
    const [isAuth, setIsAuth] = useState(false);
    const [account, setAccount] = useState({
        "username": "user@exapmle.com",
        "password": "example"
    });
    const [resErrMessage, setResErrMessage] = useState("");

    // 處理登入的input
    const handleSignInInputChange = (e) => {
        const { value, name } = e.target;
        setAccount({
            ...account,
            [name]: value
        });
    };

    // 監聽登入按鈕
    const handleSingIn = async (e) => {
        e.preventDefault(); // 可用此方式將預設行為取消掉，讓使用者可以直接按enter就可進入，不限制只透過按鈕點選
        try {
            const res = await axios.post(`${baseApi}/v2/admin/signin`, account);
            const { token, expired } = res.data;
            document.cookie = `signInHexoToken = ${token}; expires = ${new Date(expired)}`;
            axios.defaults.headers.common['Authorization'] = token;
            setIsAuth(true);
        }
        catch (error) {
            setResErrMessage(error.response?.data?.message);
            console.error(error);
        }
    };

    // 驗證登入
    const authSignIn = async (e) => {
        try {
            await axios.post(`${baseApi}/v2/api/user/check`);
            setIsAuth(true);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)signInHexoToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        axios.defaults.headers.common['Authorization'] = token;
        authSignIn();
    }, []); // []代表只戳一次

    return (
        <>
            {isAuth ?
                (
                    <div className="container text-center">
                        <h3>您已登入，請回到<Link to='/games'>密室列表頁面</Link></h3>
                    </div>
                )
                : < div className="d-flex flex-column justify-content-center align-items-center vh-100" >
                    <h2 className="mb-4 text-center">請先登入<br />才可使用購物車功能</h2>
                    <form onSubmit={handleSingIn}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail2">電子郵件</label>
                            <input
                                name="username"
                                value={account.username}
                                type="email"
                                className="form-control"
                                id="exampleInputEmail2"
                                placeholder="請輸入信箱"
                                onChange={handleSignInInputChange}
                            />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="exampleInputPassword2">密碼</label>
                            <input
                                name="password"
                                value={account.password}
                                type="password"
                                className="form-control"
                                id="exampleInputPassword2"
                                placeholder="請輸入密碼"
                                onChange={handleSignInInputChange}
                            />
                        </div>
                        {resErrMessage && (<p className="text-danger" >{resErrMessage}</p>)}
                        <button className="btn btn-success" >
                            登入
                        </button>
                    </form>
                </div >}
        </>

    )
};

export default SignIn;