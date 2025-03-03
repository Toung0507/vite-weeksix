import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
    const [tempProduct, setTempProduct] = useState([]);
    const [qtySelect, setQtySelect] = useState(1);
    const productModalRef = useRef(null);

    // 驗證登入
    const authSignIn = async (e) => {
        try {
            await axios.post(`${baseApi}/v2/api/user/check`);
            getProducts();
            setIsAuth(true);
        }
        catch (error) {
            console.error(error);
        }
    };

    // 開啟modal - 密室詳細資訊
    const openProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.show();
    };

    // 關閉modal - 密室詳細資訊
    const closeProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
    };

    // 詳細按鈕
    const handleSeeMoreProduct = (product) => {
        setTempProduct(product);
        openProductModal();
    };

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)signInHexoToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        axios.defaults.headers.common['Authorization'] = token;
        authSignIn();
    }, []); // []代表只戳一次

    // 進畫面自動取得密室列表、預定資料列表
    useEffect(() => {
        getProducts();
        getCartData();
    }, []);

    // Modal ref
    useEffect(() => {
        new Modal(productModalRef.current, {
            backdrop: false
        });
        new Modal(checkoutModalRef.current, {
            backdrop: false
        });
    }, []);

    return (<><h1>123首頁</h1></>)
}

export default App;