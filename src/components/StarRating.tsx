interface StarRatingProps {
  calificacion: number;
}

export default function StarRating({ calificacion }: StarRatingProps) {
  const stars = [];
  const MAX_STARS = 5;
  const roundedRating = Math.round(calificacion * 2) / 2;

  for (let i = 1; i <= MAX_STARS; i++) {
    if (i <= roundedRating) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star text-warning"></i>);
    }
  }

  return <div>{stars}</div>;
}