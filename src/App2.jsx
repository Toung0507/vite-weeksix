console.log('five');
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [qtySelect, setQtySelect] = useState(1);
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const productModalRef = useRef(null);
    const checkoutModalRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();  // 從react-hook-form解構出所需的值


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

    // 取德密室列表
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

    // 詳細按鈕
    const handleSeeMoreProduct = (product) => {
        setTempProduct(product);
        openProductModal();
    };

    // 送出預定資料按鈕
    const handleCheckout = () => {
        openCheckouttModal();
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
            getCartData();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "新增密室預定人數失敗"
            });
        } finally {
            setIsLoading(false);
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

    // 刪除某比預定資料
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


    return (
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
                                                <button
                                                    onClick={() => handleSeeMoreProduct(item)}
                                                    type="button"
                                                    className="btn btn-outline-info me-lg-1 me-0 mb-1 mb-lg-0"
                                                >
                                                    詳細資訊
                                                </button>
                                                <button
                                                    onClick={() => addCartItem(item.id, 1)}
                                                    type="button"
                                                    className="btn btn-outline-success d-flex align-items-center gap-2 "
                                                    disabled={isLoading}>
                                                    加到預定資料{isLoading && (<ReactLoading type={"spin"} color={"#000"} height={"1.5rem"} width={"1.5rem"} />)}
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* 密室詳細資訊的modal */}
                <div
                    ref={productModalRef}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    className="modal fade"
                    id="productModal"
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title fs-5">
                                    密室名稱：{tempProduct.title}
                                </h2>
                                <button
                                    onClick={() => closeProductModal}
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={tempProduct.imageUrl}
                                    alt={tempProduct.title}
                                    className="img-fluid"
                                />
                                <a href={tempProduct.content} target="_blank">密室官方網址</a>
                                <p>密室介紹：<br />{tempProduct.description}</p>
                                <p>
                                    單人價錢：{tempProduct.price}{" "}
                                    <del>{tempProduct.origin_price}</del> 元
                                </p>
                                <div className="input-group align-items-center">
                                    <label htmlFor="qtySelect">遊玩人數：</label>
                                    <select
                                        value={qtySelect}
                                        onChange={(e) => setQtySelect(e.target.value)}
                                        id="qtySelect"
                                        className="form-select"
                                    >
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <option key={index} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => addCartItem(tempProduct.id, qtySelect)}
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    disabled={isLoading}>
                                    加入預定資料{isLoading && (<ReactLoading type={"spin"} color={"#000"} height={"1.5rem"} width={"1.5rem"} />)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 判斷購物車是否有資料再決定是否要顯示 */}
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
            </div >

            {/* 代表人資訊 */}
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
                    <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                </div>)}

        </div >
    );
}

export default App;
