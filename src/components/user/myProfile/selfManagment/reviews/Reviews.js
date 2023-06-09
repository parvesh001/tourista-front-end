import React, { useContext, useEffect, useState } from "react";
import SingleReview from "./SingleReview";
import AddReviewForm from "../../../addReviewForm/AddReviewForm";
import { AuthContext } from "../../../../../context/auth-ctx";
import Model from "../../../../../UIs/Model/Model";
import Loader from "../../../../../UIs/loader/Loader";
import Notification from "../../../../../UIs/notification/Notification";
import NoDataFound from "../../../../../UIs/noDataFound/NoDataFound";
import style from "./Reviews.module.scss";
import LoadingPage from "../../../../../UIs/LoadingPage/LoadingPage";

export default function Reviews() {
  const { token } = useContext(AuthContext);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewState, setReviewState] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyReviews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DOMAIN_NAME}/api/v1/reviews/my-reviews`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setMyReviews(data.data.reviews);
      } catch (err) {
        setNotification({ status: "fail", message: err.message });
        setTimeout(() => setNotification(null), 3000);
      }
      setIsLoading(false);
    };
    fetchMyReviews();
  }, [token]);

  const reviewDeleteHandler = async (reviewId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DOMAIN_NAME}/api/v1/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setMyReviews((prevReviews) => {
        const newReviews = prevReviews.filter(
          (review) => review._id !== reviewId
        );
        return newReviews;
      });
      setNotification({
        status: "success",
        message: "Review deleted successfully",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ status: "fail", message: err.message });
      setTimeout(() => setNotification(null), 3000);
    }
    setIsLoading(false);
  };

  const reviewFormSubmitHandler = (editedReview) => {
    setMyReviews((prevReviews) => {
      const newReviews = [...prevReviews];
      const indexOfEditedReview = newReviews.findIndex(
        (review) => review._id === editedReview._id
      );
      newReviews[indexOfEditedReview] = { ...editedReview };
      return newReviews;
    });
  };

  if (isLoading) {
    return (
      <>
        <Model>
          <Loader />
        </Model>
        <LoadingPage />
      </>
    );
  }

  return (
    <>
      {notification && <Notification notification={notification} />}
      {myReviews.length === 0 && <NoDataFound />}
      {reviewState && (
        <AddReviewForm
          review={reviewState}
          onReviewFormSubmit={reviewFormSubmitHandler}
          setIsLoading={(value) => setIsLoading(value)}
          setReviewState={(value) => setReviewState(value)}
          setNotification={(value) => setNotification(value)}
          editing={true}
        />
      )}
      {myReviews.length !== 0 && (
        <div className={style["my-reviews-container"]}>
          {myReviews.map((review) => {
            return (
              <SingleReview
                key={review._id}
                review={review.review}
                user={review.user}
                rating={review.rating}
                onEditingReview={() =>
                  setReviewState({
                    _id: review._id,
                    review: review.review,
                    rating: review.rating,
                  })
                }
                onDeletingReview={() => reviewDeleteHandler(review._id)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
