import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from 'react-loading';

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function GamesList() {
    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(false);


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

    // 取得密室列表
    const getProducts = async () => {
        setIsAllscreenLoading(true);
        try {
            const res = await axios.get(`${baseApi}/v2/api/${apiPath}/products`);
            setProducts(res.data.products);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "取得密室列表失敗"
            });
        } finally {
            setIsAllscreenLoading(false);
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

    // 進畫面自動取得密室列表
    useEffect(() => {
        getProducts();
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
            <div className="container">
                <div className="mt-4">
                    <div className="row m-0">
                        {products.map((item) => (
                            < div className="col-lg-3 col-md-4 col-sm-6 col2 " key={item.id}>
                                <div className="card p-2 mb-3">
                                    <div className="row g-0 align-items-start h-100">
                                        <div className=" col-auto col-sm-12 ratio ratio-16x9">
                                            <picture
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            >
                                                <source media="(min-width: 576px)" srcSet={item.imageUrl} />
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="card-photo rounded-3 w-100 img-fluid"
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </picture>
                                        </div>

                                        <div className="col ms-3 ms-md-0">
                                            <div className="card-body p-0">
                                                <h6
                                                    className="card-title mb-1 mb-md-2 text-primary-black fw-bold lh-base mt-2">
                                                    {item.title}
                                                </h6>
                                                <p className="card-text text-nature-40 mb-3 fs-Body-2">
                                                    {item.category}
                                                </p>
                                                <p className="d-flex align-items-lg-center mb-2 flex-column flex-lg-row ">
                                                    <span className="rating dotted pe-3 fs-Body-2 ">
                                                        <img src="./time.png" alt="time"
                                                            className="pe-1" />{`${item.time}分鐘`}
                                                    </span>
                                                    <span className="rating dotted pe-3 fs-Body-2">
                                                        <img src="./price.png" alt="price"
                                                            className="pe-1" /><del>{item.origin_price}</del>  {item.price}元
                                                    </span>
                                                </p>
                                                <p className="d-flex justify-content-end mb-2 flex-column flex-lg-row">
                                                    <Link
                                                        className="btn btn-outline-info me-lg-1 me-0 mb-1 mb-lg-0"
                                                        to={item.id}>
                                                        詳細資訊
                                                    </Link>
                                                    {isAuth ? (<button
                                                        onClick={() => addCartItem(item.id, 1)}
                                                        type="button"
                                                        className="btn btn-outline-success d-flex align-items-center gap-2 "
                                                        disabled={isLoading}>
                                                        加到預定資料{isLoading && (<ReactLoading type={"spin"} color={"#000"} height={"1.5rem"} width={"1.5rem"} />)}
                                                    </button>) :
                                                        (<>
                                                            <button className="btn btn-outline-success d-flex align-items-center gap-2 ">
                                                                <Link to='/signIn' className="text-decoration-none">需預訂請先登入</Link>
                                                            </button>

                                                        </>)
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
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
                </div>)
            }
        </>
    )
};

export default GamesList;