import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function GameCart() {
    const [isAuth, setIsAuth] = useState(false);
    const [cardData, setCardData] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(false);
    const checkoutModalRef = useRef(null);

    // 開啟modal - 密室詳細資訊
    const openCheckouttModal = () => {
        const modalInstance = Modal.getInstance(checkoutModalRef.current);
        modalInstance.show();
    };

    // 關閉modal - 密室詳細資訊
    const closeCheckoutModal = () => {
        const modalInstance = Modal.getInstance(checkoutModalRef.current);
        modalInstance.hide();
    };

    // 取得預定資料列表(購物車)
    const getCartData = async () => {
        try {
            const res = await axios.get(`${baseApi}/v2/api/${apiPath}/cart`);
            setCardData(res.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "取得預定資料列表失敗"
            });
        }
    };

    // 更新預定資料
    const updateCartItem = async (id, product_id, qty) => {
        setIsAllscreenLoading(true);
        try {
            const data = {
                "data": {
                    product_id,
                    qty: Number(qty)
                }
            };
            await axios.put(`${baseApi}/v2/api/${apiPath}/cart/${id}`, data);
            getCartData();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "更新密室預定人數失敗"
            });
        } finally {
            setIsAllscreenLoading(false);
        }
    };

    // 刪除全數預定資料
    const delAllCart = async () => {
        setIsAllscreenLoading(true);
        try {
            await axios.delete(`${baseApi}/v2/api/${apiPath}/carts`);
            getCartData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "清空全部預定資料失敗"
            });
        } finally {
            setIsAllscreenLoading(false);
        }
    };

    // 刪除某筆預定資料
    const delOneCart = async (id) => {
        setIsAllscreenLoading(true);
        try {
            await axios.delete(`${baseApi}/v2/api/${apiPath}/cart/${id}`);
            getCartData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "刪除此筆密室預定資料失敗"
            });
        } finally {
            setIsAllscreenLoading(false);
        }
    };


    // 確認表單內容
    const onSubmit = handleSubmit((data) => {
        const { message, ...user } = data;

        const orderData = {
            data: {
                user,
                message
            }
        }
        checkoutOrder(orderData);
    });

    //送出訂單
    const checkoutOrder = async (checkoutData) => {
        try {
            const res = await axios.post(`${baseApi}/v2/api/${apiPath}/order`, checkoutData);
            if (res.data.message === "已建立訂單") {

                reset();
                closeCheckoutModal();
                getCartData();
                Swal.fire({
                    icon: "success",
                    title: "預定資料結帳成功，歡迎再次預約新的密室遊玩"
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "送出預定資料，結帳失敗"
            });
        }
    }


    // 送出預定資料按鈕
    const handleCheckout = () => {
        openCheckouttModal();
    };


    // 進畫面自動取得密室列表、預定資料列表
    useEffect(() => {
        getCartData();
    }, []);

    // Modal ref
    useEffect(() => {
        new Modal(checkoutModalRef.current, {
            backdrop: false
        });
    }, []);

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
            {isAuth ? (<div className="container">
                <div className="mt-4">
                    {
                        cardData.length == 0 ? '' : cardData.carts?.length > 0 ?
                            (
                                <>
                                    {/* 清空預定資料按鈕 */}
                                    < div className="text-end py-3">
                                        <button onClick={delAllCart} className="btn btn-danger" type="button">
                                            清空預定資料
                                        </button>
                                    </div>
                                    {/* //預定資料表單 */}
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>刪除遊戲</th>
                                                <th>遊戲名稱</th>
                                                <th style={{ width: "150px" }}>數量/單位</th>
                                                <th className="text-end">單價</th>
                                                <th className="text-end">小計</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cardData.carts?.map((cardItem) => (
                                                <tr key={cardItem.id}>
                                                    <td>
                                                        <button onClick={() => delOneCart(cardItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                                                            x
                                                        </button>
                                                    </td>
                                                    <td>{cardItem.product.title}</td>
                                                    <td style={{ width: "150px" }}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="btn-group me-2" role="group">
                                                                <button
                                                                    onClick={() => updateCartItem(cardItem.id, cardItem.product_id, cardItem.qty - 1)}
                                                                    type="button"
                                                                    className="btn btn-outline-dark btn-sm"
                                                                    disabled={cardItem.qty == 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span
                                                                    className="btn border border-dark"
                                                                    style={{ width: "50px", cursor: "auto" }}
                                                                >
                                                                    {cardItem.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateCartItem(cardItem.id, cardItem.product_id, cardItem.qty + 1)}
                                                                    type="button"
                                                                    className="btn btn-outline-dark btn-sm"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <span className="input-group-text bg-transparent border-0">
                                                                {cardItem.product.unit}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-end">{cardItem.product.price}</td>
                                                    <td className="text-end">{cardItem.total}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="5" className="text-end">
                                                    總計：{cardData.final_total}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="5" className="text-end">
                                                    <button
                                                        onClick={handleCheckout}
                                                        type="button"
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        送出預定資料</button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </>
                            )
                            : (<><p className=" border border-black text-center fs-3 mb-3">尚未有預定資料</p></>)

                    }
                </div>
            </div>) : '尚未登入'}

            <div
                ref={checkoutModalRef}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                className="modal fade"
                id="checkoutModal"
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5">
                                填寫預定資料的代表人資料
                            </h2>
                            <button
                                onClick={closeCheckoutModal}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        {...register('email', {
                                            required: "Email欄位必填",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Email格式錯誤"
                                            }
                                        })}
                                        id="email"
                                        type="email"
                                        className={`form-control ${errors.email && 'is-invalid'} `}
                                        placeholder="請輸入 Email"
                                    />

                                    {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        代表人姓名
                                    </label>
                                    <input
                                        {...register('name', {
                                            required: "姓名欄位必填",
                                        })}
                                        id="name"
                                        className={`form-control ${errors.name && 'is-invalid'} `}
                                        placeholder="請輸入姓名"
                                    />

                                    {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tel" className="form-label">
                                        代表人電話
                                    </label>
                                    <input
                                        {...register('tel', {
                                            required: "電話欄位必填",
                                            pattern: {
                                                value: /^(0[2-8]\d{7}|09\d{8})$/,
                                                message: "電話格式錯誤"
                                            }

                                        })}
                                        id="tel"
                                        type="text"
                                        className={`form-control ${errors.tel && 'is-invalid'} `}
                                        placeholder="請輸入電話"
                                    />

                                    {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        代表人地址
                                    </label>
                                    <input
                                        {...register('address', {
                                            required: "地址欄位必填",
                                        })}
                                        id="address"
                                        type="text"
                                        className={`form-control ${errors.address && 'is-invalid'} `}
                                        placeholder="請輸入地址"
                                    />
                                    {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">
                                        留言
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        id="message"
                                        className="form-control"
                                        cols="30"
                                        rows="10"
                                    ></textarea>
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-danger">
                                        送出預訂
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
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
                    <p className="text-center">
                        更新訂單中
                        <br />
                        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />

                    </p>
                </div>)}
        </>

    )
}

export default GameCart;