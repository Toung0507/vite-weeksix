import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from 'react-loading';
import { Link, useParams } from "react-router-dom";

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function GameDetail() {
    const [isAuth, setIsAuth] = useState(false);
    const [product, setProduct] = useState([]);
    const [qtySelect, setQtySelect] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(false);
    const { id: product_id } = useParams();

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

    // 加入預定資料
    const addCartItem = async (product_id, qty) => {
        setIsLoading(true);
        try {
            const data = {
                "data": {
                    product_id,
                    qty: Number(qty)
                }
            };
            await axios.post(`${baseApi}/v2/api/${apiPath}/cart`, data);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "新增密室預定人數失敗"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 取得某密室
    const getProduct = async () => {
        setIsAllscreenLoading(true);
        try {
            const res = await axios.get(`${baseApi}/v2/api/${apiPath}/product/${product_id}`);
            setProduct(res.data.product);
            console.log(res.data.product);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "取得密室列表失敗"
            });
        } finally {
            setIsAllscreenLoading(false);
        }
    };

    useEffect(() => {
        getProduct();
    }, []);


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
            <div className="container mt-5">
                <div className="row">
                    <div className="col-6">
                        <img className="img-fluid" src={product.imageUrl} alt={product.title} />
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                            <h2>{product.title}</h2>
                            <span className="badge text-bg-success">{product.category}</span>
                        </div>
                        <p className="mb-3">{product.description}</p>
                        <a href={product.content} target="_blank">密室官方網址</a>
                        <h5 className="mb-3">單人價錢：NT$ {product.price}</h5>
                        <div className="input-group align-items-center w-75">
                            遊玩人數：
                            <select
                                value={qtySelect}
                                onChange={(e) => setQtySelect(e.target.value)}
                                id="qtySelect"
                                className="form-select"
                            >
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}人
                                    </option>
                                ))}
                            </select>
                            {isAuth ? (<button
                                onClick={() => addCartItem(product.id, qtySelect)}
                                type="button"
                                className="btn btn-primary d-flex align-items-center gap-2"
                                disabled={isLoading}>
                                加到預定資料{isLoading && (<ReactLoading type={"spin"} color={"#000"} height={"1.5rem"} width={"1.5rem"} />)}
                            </button>) :
                                (<>
                                    <button className="btn btn-primary d-flex align-items-center gap-2">
                                        <Link to='/signIn' className="text-decoration-none link-light">需預訂請先登入</Link>
                                    </button>
                                </>)
                            }
                        </div>
                    </div>
                </div>
            </div>
            {isAllscreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        zIndex: 999,
                    }}
                >
                    <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                </div>)}
        </>
    )
};


export default GameDetail;