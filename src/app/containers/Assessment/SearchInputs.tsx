import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    paper: {
      position: 'relative',
      top: 36,
      right: 0,
      left: 0,
      zIndex: 9999,
      height: '400px',
      overflowY: 'auto',
    },
    query: {
      fontSize: '14px',
      color: '#959595',
    },
  }),
);
interface PropsType {
  searchFn: (query: string) => Promise<Array<any>>;
  itemRenderer: (item: any) => JSX.Element;
  onItemSelect: (item: any) => void;
  onChange: (string) => void;
}
const Search: React.FC<PropsType> = ({
  searchFn,
  itemRenderer,
  placeholder,
  Namevalue,
  onItemSelect,
  onChange,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [items, setItems] = React.useState([]);
  const timeoutRef = React.useRef(null);
  React.useEffect(() => {
    if (query.length > 2) {
      timeoutRef.current = setTimeout(
        () => {
          searchFn(query).then((results) => {
            setItems(results);
          });
        },
        query.length === 3 ? 0 : 500,
      );
    } else if (query.length === 0) {
      setItems([]);
    }
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [query, searchFn]);
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div>
          <TextField
            placeholder={placeholder}
            fullWidth
            value={Namevalue}
            onClick={() => setOpen(true)}
            onChange={(e) => {
              onChange && onChange(e.currentTarget.value);
              setQuery(e.currentTarget.value);
            }}
          />
          {open && query.length && items.length ? (
            <Paper className={classes.paper}>
              <Divider />
              {items.map((item) => (
                <div
                  onClick={() => {
                    setOpen(false);
                    onItemSelect(item);
                  }}
                >
                  {itemRenderer(item)}
                </div>
              ))}
            </Paper>
          ) : null}
        </div>
      </ClickAwayListener>
    </div>
  );
};
export default Search;
