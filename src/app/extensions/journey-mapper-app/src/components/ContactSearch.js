import React, { useState, useEffect, useRef } from 'react';
import { searchContacts, fetchContactById } from '../utils/hubspotApi';
import './ContactSearch.css';

const ContactSearch = ({ accessToken, onContactSelect, initialContactId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load initial contact if ID is provided
  useEffect(() => {
    if (initialContactId && accessToken) {
      loadInitialContact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContactId, accessToken]);

  const loadInitialContact = async () => {
    try {
      setIsLoading(true);
      const contact = await fetchContactById(initialContactId, accessToken);
      if (contact) {
        setSelectedContact(contact);
        onContactSelect(contact);
        setSearchQuery(`${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim());
      }
    } catch (error) {
      console.error('Error loading initial contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchContacts(query, accessToken);
      setSearchResults(results);
      setIsDropdownOpen(results.length > 0);
    } catch (error) {
      console.error('Error searching contacts:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setSearchQuery(`${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim());
    setIsDropdownOpen(false);
    onContactSelect(contact);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 2 && searchResults.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const clearSelection = () => {
    setSelectedContact(null);
    setSearchQuery('');
    onContactSelect(null);
  };

  return (
    <div className="contact-search-container">
      <label htmlFor="contact-search">Search Contacts:</label>
      <div className="search-input-wrapper" ref={searchRef}>
        <input
          id="contact-search"
          type="text"
          className="contact-search-input"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        {isLoading && <div className="search-loader"></div>}
        {selectedContact && (
          <button type="button" className="clear-button" onClick={clearSelection}>
            ✕
          </button>
        )}
      </div>
      
      {isDropdownOpen && (
        <div className="search-results-dropdown" ref={dropdownRef}>
          {searchResults.length > 0 ? (
            searchResults.map((contact) => (
              <div
                key={contact.id}
                className="contact-result-item"
                onClick={() => handleContactSelect(contact)}
              >
                <div className="contact-name">
                  {contact.properties.firstname || ''} {contact.properties.lastname || ''}
                </div>
                <div className="contact-email">{contact.properties.email || 'No email'}</div>
              </div>
            ))
          ) : (
            <div className="no-results">No contacts found</div>
          )}
        </div>
      )}
      
      {selectedContact && (
        <div className="selected-contact-info">
          <h4>Selected Contact</h4>
          <p>
            <strong>Name:</strong> {selectedContact.properties.firstname || ''} {selectedContact.properties.lastname || ''}
          </p>
          <p>
            <strong>Email:</strong> {selectedContact.properties.email || 'No email'}
          </p>
          <p>
            <strong>Lifecycle Stage:</strong> {selectedContact.properties.lifecyclestage || 'Not set'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactSearch;
