import React, { useEffect } from 'react'
import { useMyOrdersQuery } from '../../redux/api/orderApi'
import toast from 'react-hot-toast';
import Loader from '../layout/Loader'
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from "../../redux/features/cartSlice"
import MetaData from '../layout/MetaData';
const MyOrders = () => {
  const { data, error, isLoading } = useMyOrdersQuery();

  console.log(data)

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {

    if (error) {
      toast.error(error.data.message)
    }

    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders")
    }
  }, [error, orderSuccess]);

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    }

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        amount: `$${order?.totalAmount}`,
        status: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link to={`/me/order/${order?._id}`} className='btn btn-primary'>
              <i className='fa fa-eye'></i>
            </Link>
            <Link to={`/invoice/order/${order?._id}`} className='btn btn-success ms-2'>
              <i className='fa fa-print'></i>
            </Link>
          </>
        ),
      })
    })

    return orders;
  }

  if (isLoading) return <Loader />
  return (
    <div>
      <MetaData title={"My Order"} />
      <h1 class="my-5">{data?.orders?.length} Orders</h1>

      <MDBDataTable
        data={setOrders()}
        className='px-3'
        bordered
        striped
        hover
      />
    </div >
  )
}

export default MyOrders