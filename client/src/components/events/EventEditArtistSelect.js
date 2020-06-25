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
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';

/* constants */

const emptyArtistInEventForAdd = {
  role_tc: '',
  role_sc: '',
  role_en: '',
  artist: { _id: '' }
};

const mapArtistToListItem = artist => {
  return {
    ...artist,
    value: artist._id,
    label: artist.name_tc
  };
};

const mapArtistInEventToListItem = artistInEvent => {
  return {
    ...artistInEvent,
    draggableId: artistInEvent.draggableId || artistInEvent._id || guid()
  };
};

/* end of constants */

/* ArtistSelect */

const ArtistSelect = ({ artistSelected, onGetArtistSelected }) => {
  const { eventArtists: fetchedEventArtists, eventArtistsLoading } = useContext(
    ArtistsContext
  );

  const [artists, setArtists] = useState([]);

  // artist in event
  const artistInEventSelected = useMemo(
    _ => {
      return artistSelected ? mapArtistToListItem(artistSelected) : null;
    },
    [artistSelected]
  );

  // artist options
  const artistOptions = useMemo(
    _ => {
      return getArraySafe(artists).map(mapArtistToListItem);
    },
    [artists]
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
      onGetArtistSelected(option);
    },
    [onGetArtistSelected]
  );

  /* end of event handlers */

  return (
    <AsyncSelect
      name='artist'
      value={artistInEventSelected}
      options={artistOptions}
      isLoading={eventArtistsLoading}
      placeholder={uiWordings['EventEdit.Artist.ArtistPlaceholder']}
      onChange={handleSelectChange}
    />
  );
};

/* EventEditArtistSelect */

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 650
});

const Item = ({
  artistInEvent,
  handleItemRemoved,
  handleItemChange,
  index
}) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newArtistInEvent => {
      handleItemChange(newArtistInEvent, index);
    },
    [handleItemChange, index]
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
    [artistInEvent, dealWithItemChange]
  );

  const onGetArtistSelected = useCallback(
    artistSelected => {
      const newArtistInEvent = {
        ...artistInEvent,
        artist: artistSelected
      };
      dealWithItemChange(newArtistInEvent);
    },
    [artistInEvent, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { role_tc, role_sc, role_en, artist, draggableId } = artistInEvent;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          className='w3-row'
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
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='role_sc'
                value={role_sc}
                placeholder={uiWordings['EventEdit.Artist.RoleScPlaceholder']}
                onChange={onChange}
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='role_en'
                value={role_en}
                placeholder={uiWordings['EventEdit.Artist.RoleEnPlaceholder']}
                onChange={onChange}
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <ArtistSelect
                artistSelected={artist}
                onGetArtistSelected={onGetArtistSelected}
              />
            </div>
          </div>
          <div className='w3-rest'>
            {isFunction(handleItemRemoved) ? (
              <LabelSortableListPair.ItemRemoveButton
                className='w3-right'
                onClick={onRemoveButtonClick}
              />
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
      artistInEvent={artistInEvent}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

const EventEditArtistSelect = ({ artistsPicked, onGetArtistsPicked }) => {
  const artistsInPickedList = useMemo(
    _ => {
      return getArraySafe(artistsPicked).map(mapArtistInEventToListItem);
    },
    [artistsPicked]
  );

  /* methods */

  const dealWithGetArtistsPicked = useCallback(
    newItemList => {
      onGetArtistsPicked(newItemList);
    },
    [onGetArtistsPicked]
  );

  const addArtistInEvent = useCallback(
    _ => {
      dealWithGetArtistsPicked([
        ...getArraySafe(artistsPicked),
        emptyArtistInEventForAdd
      ]);
    },
    [artistsPicked, dealWithGetArtistsPicked]
  );

  /* end of methods */

  // // artistsPicked
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(artistsPicked)) {
  //       addArtistInEvent();
  //     }
  //   },
  //   [artistsPicked, addArtistInEvent]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addArtistInEvent();
    },
    [addArtistInEvent]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetArtistsPicked(newItemList);
    },
    [dealWithGetArtistsPicked]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='artists'
      labelMessage={uiWordings['Event.ArtistsLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={artistsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default EventEditArtistSelect;
