import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ArtistsContext from 'contexts/artists/artistsContext';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import AsyncSelect from 'components/form/AsyncSelect';
import InputText from 'components/form/InputText';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray, { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction, { invokeIfIsFunction } from 'utils/js/function/isFunction';

const mapArtistToListItem = artist => {
  return {
    ...artist,
    value: artist._id,
    label: artist.name_tc
  };
};

const mapArtistInEventToListItem = artistInEvent => {
  return {
    ...artistInEvent
  };
};

/* ArtistSelect */

const ArtistSelect = ({ controlledArtistSelected, onGetArtistSelected }) => {
  const { eventArtists: fetchedEventArtists, eventArtistsLoading } = useContext(
    ArtistsContext
  );

  const [artistSelected, setArtistSelected] = useState(null);
  const [artists, setArtists] = useState([]);

  // artist options
  const artistOptions = useMemo(
    _ => {
      return getArraySafe(artists).map(mapArtistToListItem);
    },
    [artists, mapArtistToListItem]
  );

  // controlledArtistSelected
  useEffect(
    _ => {
      if (controlledArtistSelected) {
        setArtistSelected(mapArtistToListItem(controlledArtistSelected));
      }
    },
    [controlledArtistSelected]
  );

  // fetchedEventArtists
  useEffect(
    _ => {
      if (!eventArtistsLoading) {
        if (isNonEmptyArray(fetchedEventArtists)) {
          setArtists(fetchedEventArtists);
        }
      }
    },
    [eventArtistsLoading, fetchedEventArtists]
  );

  /* event handlers */

  const handleSelectChange = useCallback(
    option => {
      setArtistSelected(option);
      onGetArtistSelected(option);
    },
    [setArtistSelected, onGetArtistSelected]
  );

  /* end of event handlers */

  return (
    <AsyncSelect
      name='artist'
      value={artistSelected}
      options={artistOptions}
      isLoading={eventArtistsLoading}
      placeholder={uiWordings['EventEdit.Artist.ArtistPlaceholder']}
      onChange={handleSelectChange}
    />
  );
};

/* EventEditArtistSelect */

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid, //grid * 2,
  margin: `0 0 ${grid}px 0`, //`0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white', //isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: `${grid}px ${grid}px ${grid * 0.5}px ${grid}px`,
  width: 650
});

// https://reactjs.org/docs/hooks-reference.html#useimperativehandle
const Item = ({
  controlledArtistInEvent,
  handleItemRemoved,
  handleItemChange,
  index
}) => {
  const [artistInEvent, setArtistInEvent] = useState({
    role_tc: '',
    role_sc: '',
    role_en: '',
    artist: {
      _id: Date.now().toString()
    }
  });

  useEffect(
    _ => {
      if (controlledArtistInEvent) {
        setArtistInEvent(controlledArtistInEvent);
      }
    },
    [controlledArtistInEvent, setArtistInEvent]
  );

  /* methods */

  const dealWithItemChange = useCallback(
    newArtistInEvent => {
      setArtistInEvent(newArtistInEvent);
      handleItemChange(newArtistInEvent, index);
    },
    [setArtistInEvent, handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newArtistInEvent = {
        ...artistInEvent,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newArtistInEvent);
    },
    [artistInEvent, setArtistInEvent, dealWithItemChange]
  );

  const onGetArtistSelected = useCallback(
    artistSelected => {
      const newArtistInEvent = {
        ...artistInEvent,
        artist: artistSelected
      };
      dealWithItemChange(newArtistInEvent);
    },
    [artistInEvent, setArtistInEvent, dealWithItemChange]
  );

  /* end of event handlers */

  const { role_tc, role_sc, role_en, artist } = artistInEvent;

  return (
    <Draggable key={artist._id} draggableId={artist._id} index={index}>
      {(provided, snapshot) => (
        <div
          className='w3-row list-item'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className='w3-col m11 w3-row'>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='role_tc'
                value={role_tc}
                placeholder={uiWordings['EventEdit.Artist.RoleTcPlaceholder']}
                onChange={onChange}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='role_sc'
                value={role_sc}
                placeholder={uiWordings['EventEdit.Artist.RoleScPlaceholder']}
                onChange={onChange}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='role_en'
                value={role_en}
                placeholder={uiWordings['EventEdit.Artist.RoleEnPlaceholder']}
                onChange={onChange}
              />
            </div>
            <div className='w3-col m3'>
              <ArtistSelect
                controlledArtistSelected={artist}
                onGetArtistSelected={onGetArtistSelected}
              />
            </div>
          </div>
          <div className='w3-rest'>
            {isFunction(handleItemRemoved) ? (
              <span
                className='w3-right remove-btn'
                onClick={_ => handleItemRemoved(index)}
              >
                <i className='fa fa-times' />
              </span>
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const itemRender = (
  { handleItemRemoved, handleItemChange, ...artistInEvent },
  index
) => {
  return (
    <Item
      key={index}
      controlledArtistInEvent={artistInEvent}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

const EventEditArtistSelect = ({ initialArtistsPicked }) => {
  // artists in picked list
  const [artistsPicked, setArtistsPicked] = useState([]);

  const artistsInPickedList = useMemo(
    _ => {
      return artistsPicked.map(mapArtistInEventToListItem);
    },
    [artistsPicked, mapArtistInEventToListItem]
  );

  /* methods */

  const addArtistInEvent = useCallback(
    _ => {
      setArtistsPicked([
        ...artistsPicked,
        {
          role_tc: '',
          role_sc: '',
          role_en: '',
          artist: { _id: Date.now().toString() }
        }
      ]);
    },
    [artistsPicked, setArtistsPicked]
  );

  /* end of methods */

  // initialArtistsPicked
  useEffect(
    _ => {
      if (isNonEmptyArray(initialArtistsPicked)) {
        setArtistsPicked(initialArtistsPicked);
      }
    },
    [initialArtistsPicked, setArtistsPicked]
  );

  // artistsPicked
  useEffect(
    _ => {
      if (!isNonEmptyArray(artistsPicked)) {
        addArtistInEvent();
      }
    },
    [artistsPicked, addArtistInEvent]
  );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addArtistInEvent();
    },
    [addArtistInEvent]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      setArtistsPicked(newItemList);
    },
    [setArtistsPicked]
  );

  /* end of event handlers */

  return (
    <div className='event-edit-artist-select'>
      <LabelSortableListPair
        name='artists'
        labelMessage={uiWordings['Event.ArtistsLabel']}
        pickedItemRender={itemRender}
        getListStyle={getListStyle}
        controlledPickedItems={artistsInPickedList}
        getPickedItems={onGetPickedItems}
        onAddButtonClick={onAddButtonClick}
      />
    </div>
  );
};

export default EventEditArtistSelect;
