import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Close';
import styles from './Search.module.css';

const Search: React.FC = ({ onSearch }) => {
  const [searchText, setSearch] = React.useState('');
  const [focused, setFocus] = React.useState(false);
  const inputRef = React.useRef(null);
  return (
    <div className={`${styles.search} ${focused && styles.searchInputFocused}`}>
      <div className={styles.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        ref={inputRef}
        classes={{
          root: `${styles.inputRoot} ${searchText && styles.searchInputActive}`,
          input: styles.inputInput,
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          !searchText && setFocus(false);
        }}
        value={searchText}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch(e.target.value);
        }}
        inputProps={{ 'aria-label': 'Search' }}
      />
      {searchText && (
        <IconButton
          className={styles.clearButton}
          onClick={() => {
            inputRef.current.focus();
            console.log(inputRef);
            setSearch('');
            onSearch('');
          }}
        >
          <RemoveIcon className={styles.icon} />
        </IconButton>
      )}
    </div>
  );
};

export default Search;
