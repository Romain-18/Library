import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../components/pagination';
import ItemsPerPage from '../components/ItemsPerPage';
import './Recherche.css';

const Recherche = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const term = searchParams.get('term');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loadingPage, setLoadingPage] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await fetch(`https://openlibrary.org/search.json?title=${term}`);
        const data = await response.json();
        setCachedResults(data.docs);
      } catch (error) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [term]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoadingPage(true);
        setHasError(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingPage(false);
      } catch (error) {
        setHasError(true);
        setLoadingPage(false);
      }
    };

    fetchPageData();
  }, [currentPage, itemsPerPage]);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = cachedResults.slice(indexOfFirstItem, Math.min(indexOfLastItem, cachedResults.length));

  const totalPages = Math.ceil(cachedResults.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
      <div>
        {loading ? (
           <p className="container">
            <span className="loader"></span></p>
        ) : hasError ? (
            <p>An error occurred while searching.</p>
        ) : (
            cachedResults.length > 0 ? (
                <div className="container">
                  <div className="row">
                    {currentItems.map((oeuvre, index) => (
                        <div className="col-md-3 col-sm-6 mb-4" key={index}>
                          <Link to={`/oeuvres?key=${oeuvre.key}`} className="card-link">
                            <div className="card">
                              <div className="card-img-wrapper">
                                {oeuvre.cover_i ? (
                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${oeuvre.cover_i}-L.jpg`}
                                        className="card-img-top img-fluid"
                                        alt={oeuvre.title}
                                    />
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                    <img
                                        src="/image-not-found.jpg"
                                        className="card-img-top img-fluid"
                                        alt="Image not found"
                                    />
                                )}
                              </div>
                              <div className="card-body">
                                <h5 className="card-title">{oeuvre.title}</h5>
                                <p className="card-text">Author : {oeuvre.author_name ? oeuvre.author_name.join(', ') : 'Unknown author'}</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                    ))}
                  </div>
                </div>
            ) : (
                <p>No results found.</p>
            )
        )}

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            nextPage={nextPage}
            prevPage={prevPage}
        />

        <ItemsPerPage
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            loadingPage={loadingPage}
        />
      </div>
  );
};

export default Recherche;
