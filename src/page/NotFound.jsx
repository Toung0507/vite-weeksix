import { Link } from "react-router-dom";


function NotFound() {
    return (
        <>
            <h1>此路由(網址)找不到相關資訊</h1>
            <Link to='/'>回到首頁</Link >
        </>
    )
};

export default NotFound;