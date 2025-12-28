import { useState, useEffect } from 'react';

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        
        const formattedCountries = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err.message);
        // Fallback to a basic list of countries
        setCountries(getFallbackCountries());
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Fallback country list in case API fails
  const getFallbackCountries = () => {
    return [
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Germany', code: 'DE' },
      { name: 'France', code: 'FR' },
      { name: 'Canada', code: 'CA' },
      { name: 'Australia', code: 'AU' },
      { name: 'Japan', code: 'JP' },
      { name: 'China', code: 'CN' },
      { name: 'India', code: 'IN' },
      { name: 'Brazil', code: 'BR' },
    ].sort((a, b) => a.name.localeCompare(b.name));
  };

  return { countries, loading, error };
};

export default useCountries;