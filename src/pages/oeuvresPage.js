import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const cleanText = (text) => {
  if (!text) return '';
  const cleanHTML = text.replace(/<[^>]+>/g, '');
  const cleanSpecialChars = cleanHTML.replace(/[^\w\s]/gi, '');
  return cleanSpecialChars;
};

const OeuvresPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get('key');
  const [oeuvreDetails, setOeuvreDetails] = useState(null);
  const [wikipediaExtract, setWikipediaExtract] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${key}`
        );
        const data = await response.json();
        const firstResult = data.docs[0];
        const oeuvre = {
          title: firstResult.title,
          author_name: firstResult.author_name ? firstResult.author_name.join(', ') : 'Unknown author',
          cover_i: firstResult.cover_i,
          first_publish_year: firstResult.first_publish_year,
          subject: firstResult.subject ? firstResult.subject[0] : 'Unknown subject',
        };
        setOeuvreDetails(oeuvre);
        setLoading(false);

        const wikipediaResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&titles=${encodeURIComponent(oeuvre.title)}&origin=*`);
        const wikipediaData = await wikipediaResponse.json();
        const pages = wikipediaData.query.pages;
        const wikipediaDetail = pages[Object.keys(pages)[0]];

        if (wikipediaDetail && !('missing' in wikipediaDetail)) {
          const extract = wikipediaDetail.extract || 'No description available on Wikipedia.';
          setWikipediaExtract(extract);
        } else {
          setWikipediaExtract('No description available on Wikipedia.');
        }
      } catch (error) {
        console.error('Error fetching oeuvre details:', error);
        setHasError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>An error occurred while loading the details of the work.</div>;
  }

  if (!oeuvreDetails) {
    return <div>No details found for this work.</div>;
  }

  const { title, author_name, cover_i, first_publish_year, subject } = oeuvreDetails;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          {cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`}
              className="card-img-top img-fluid"
              alt={title}
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
        <div className="col-md-6">
          <h2 className="card-title">Details</h2>
          <h3>Title: {title}</h3>
          <p>Author: {author_name}</p>
          <p>Publication Year: {first_publish_year}</p>
          <p>Subject: {subject}</p>
          <p>Link to Wikipedia: <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">Wikipedia</a></p>
          <p>Description (Wikipedia): {cleanText(wikipediaExtract)}</p>
        </div>
      </div>
    </div>
  );
};

export default OeuvresPage;
