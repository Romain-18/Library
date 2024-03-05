import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/pagination';
import ItemsPerPage from '../components/ItemsPerPage';
import './rechercheAvancée.css';

const AdvancedSearch = () => {
  const [option] = useState('title'); 
  const [title, setTitle] = useState(''); 
  const [author, setAuthor] = useState(''); 
  const [type, setType] = useState(''); 
  const [sortOption, setSortOption] = useState('relevance'); 
  const [cachedResults, setCachedResults] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [loadingPage] = useState(false); 

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetch(`https://openlibrary.org/search.json${buildQuery()}`);
      const data = await response.json();
      setCachedResults(data.docs);
      setWorks(data.docs);
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const buildQuery = () => {
    let searchQuery = '?';
    if (title) searchQuery += `${option}=${title}&`;
    if (author) searchQuery += `author=${author}&`;
    if (type) searchQuery += `subject=${type}&`;
    if (sortOption !== 'relevance') searchQuery += `sort=${sortOption}&`;
    return searchQuery;
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = works.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="search-container-wrapper">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container fond-gris">
              <div className="search-input-container">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="search-input"
                    placeholder="Title"
                />
              </div>
              <div className="search-input-container">
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="search-input"
                    placeholder="Author"
                />
              </div>
              <div className="search-input-container">
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="search-input"
                    placeholder="Type"
                />
              </div>
              <div className="search-button-container">
                <button type="submit" className="search-button">Search</button>
              </div>
            </div>
            <div className="dropdown-container">
              <select className="dropdown" value={sortOption} onChange={handleSortChange}>
                <option value="">Relevance</option>
                <option value="new">Publication Date (Newest to Oldest)</option>
                <option value="old">Publication Date (Oldest to Newest)</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </form>
        </div>

        <div>
          {loading ? (
              <p className="container">
                <span className="loader"></span></p>

          ) : hasError ? (
              <p>An error occurred while searching.</p>
          ) : (
              works.length > 0 ? (
                  <div className="container">
                    <div className="row">
                      {currentItems.map((work, index) => (
                          <div className="col-md-3 col-sm-6 mb-4" key={index}>
                            <Link to={`/works?key=${work.key}`} className="card-link">
                              <div className="card">
                                <div className="card-img-wrapper">
                                  {work.cover_i ? (
                                      <img
                                          src={`https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`}
                                          className="card-img-top img-fluid"
                                          alt={work.title}
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
                                  <h5 className="card-title">{work.title}</h5>
                                  <p className="card-text">Author
                                    : {work.author_name ? work.author_name.slice(0, 3).join(', ') : 'Unknown Author'}</p>
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
        </div>

        <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={cachedResults.length}
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

export default AdvancedSearch;
