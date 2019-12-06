import * as React from 'react';
import { Button, Grid, Menu, MenuItem } from '@material-ui/core';
import { tl } from '../../components/translate';

const AddMoreMenu = ({ assessment, setAddMoreListing }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <>
      {assessment &&
        assessment.addMore &&
        assessment.addMore.listing &&
        assessment.addMore.listing.length ? (
          <Grid className={"addMoreMrgn"}>
            <Grid>
              <Button
                onClick={(event) => {
                  setMenuOpen(!menuOpen);
                  setAnchorEl(event.currentTarget)
                }}
                className={"btnUnderLine"}
                disabled={assessment.edit}
              >
                {tl("Add more +")}
              </Button>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        keepMounted
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        {assessment.addMore &&
          assessment.addMore.listing &&
          assessment.addMore.listing.length
          ? assessment.addMore.listing.map((data, index) => (
            <MenuItem
              onClick={() => {
                setAnchorEl(false);
                setAddMoreListing(index, data.key);
                setMenuOpen(false);
              }}
            >
              {tl(data.value)}
            </MenuItem>
          ))
          : ""}
      </Menu>
    </>);
};

export default AddMoreMenu;