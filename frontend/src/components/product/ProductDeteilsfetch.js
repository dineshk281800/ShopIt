import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import Loader from '../layout/Loader'
import StarRatings from 'react-star-ratings'

import { useDispatch, useSelector } from 'react-redux'
import { setCartItem } from "../../redux/features/cartSlice"

import MetaData from '../layout/MetaData'
import NewReview from '../reviews/NewReview'
import ListReviews from '../reviews/ListReviews'


const ProductDetails = () => {
    const { id } = useParams();
    console.log(id)

    const dispatch = useDispatch();

    const [productData, setProductData] = useState([]);
    const [images, setImages] = useState([]);

    const [quantity, setQuantity] = useState(1)

    const [activeImage, setActiveImage] = useState('')

    const [load, setLoad] = useState(true);
    const productFetchData = useCallback(async () => {
        try {
            const result = await fetch(`http://localhost:8000/api/v1/products/${id}`)
            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            }
            if (!productData) return <Loader />
            const data = await result.json()
            console.log(data)
            console.log(data.product.images)
            setLoad(false)
            setActiveImage(data.product.images[0] ? data.product.images[0].url : "./images//default_product.png")
            setProductData(data.product)
            setImages(data.product.images)
        } catch (error) {
            toast.error(error.message);
        }
    }, [id])

    // new
    const { isAuthenticated } = useSelector((state) => state.auth)
    console.log(isAuthenticated)
    useEffect(() => {
        // setTimeout(() => {
        // })
        productFetchData()
        // console.log(productData)
        console.log(productData.images)
        // setActiveImage(productData.images[0] ? productData.images[0].url : "./images//default_product.png")
    }, []);


    const increaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber >= productData?.stock) return;

        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }
    const decreaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    const setItemToCart = () => {
        const cartItem = {
            product: productData._id,
            name: productData.name,
            price: productData.price,
            image: productData.images[0].url,
            stock: productData.stock,
            quantity,
        };
        dispatch(setCartItem(cartItem))
        toast.success("Item added to Cart")
    }

    if (load) return <Loader />
    // if (!productData) return <Loader />
    return (
        <>
            <MetaData title={productData?.name} />
            <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <div className="p-3">
                        <img
                            className="d-block w-100"
                            src={activeImage}
                            alt={productData.name}
                            width="340"
                            height="390"
                        />
                    </div>
                    <div className="row justify-content-start mt-5">
                        {
                            images.map((image) => (
                                <div className="col-2 ms-4 mt-2">
                                    <a role="button">
                                        <img
                                            className={`d-block border rounded p-3 cursor-pointer ${image.url === activeImage ? "border-warning" : ""}`}
                                            height="100"
                                            width="100"
                                            src={image.url}
                                            alt={image.url}
                                            onClick={(e) => setActiveImage(image.url)}
                                        />
                                    </a>
                                </div>
                            ))
                        }

                    </div>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{productData.name}</h3>
                    <p id="product_id">Product # {productData._id}</p>

                    <hr />

                    <div className="d-flex">
                        <StarRatings
                            rating={productData.ratings}
                            starRatedColor="#ffb829"
                            // changeRating={this.changeRating}
                            numberOfStars={5}
                            name='rating'
                            starDimension='24px'
                            starSpacing='1px'
                        />
                        <span id="no-of-reviews" className="pt-1 ps-2"> ({productData.numOfReviews} Reviews) </span>
                    </div>
                    <hr />

                    <p id="product_price">${productData.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>
                            -
                        </span>
                        <input
                            type="number"
                            className="form-control count d-inline"
                            value={quantity}
                            readonly
                        />
                        <span className="btn btn-primary plus" onClick={increaseQty}>
                            +
                        </span>
                    </div>
                    <button
                        type="button"
                        id="cart_btn"
                        className="btn btn-primary d-inline ms-4"
                        disabled={productData.stock <= 0}
                        onClick={setItemToCart}
                    >
                        Add to Cart
                    </button>

                    <hr />

                    <p>
                        Status: <span id="stock_status" className={productData.stock > 0 ? "greenColor" : "redColor"}>
                            {productData.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                    </p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>
                        {productData.description}
                    </p>
                    <hr />
                    <p id="product_seller mb-3">Sold by: <strong>{productData.seller}</strong></p>

                    {/* new */}
                    {/* {true ? ( */}
                    {isAuthenticated ? (
                        < NewReview productId={productData?._id} />
                    ) : (
                        <div className="alert alert-danger my-5" type="alert">
                            Login to post your review.
                        </div>
                    )}

                </div>
            </div>
            {productData?.reviews?.length > 0 && (
                <ListReviews reviews={productData?.reviews} />
            )}
        </>
    )
}

export default ProductDetails