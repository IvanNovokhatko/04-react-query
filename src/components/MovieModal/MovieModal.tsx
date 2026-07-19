import css from "./MovieModal.module.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";

interface MovieModalProps {
    onClose: () => void;
    movie: Movie;
}

export default function MovieModal({ onClose, movie }: MovieModalProps) {
    
    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);
    
    const modalRoot = document.getElementById("modal-root") || document.body;
    
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      {/* e.stopPropagation prevents the modal from closing when clicking inside the window */}
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={css.closeButton} 
          aria-label="Close modal" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <img
          src={
            `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          }
          alt={movie.title}
          className={css.image}
        />
        
        <div className={css.content}>
          <h2 className={css.title}>{movie.title}</h2>
          <p className={css.overview}>{movie.overview || "No overview available."}</p>
          
          <div className={css.meta}>
            <p>
              <strong>Release Date:</strong> {movie.release_date || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : "0.0/10"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}