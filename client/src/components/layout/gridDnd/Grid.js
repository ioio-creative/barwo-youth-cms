import React from 'react';
import styled from 'styled-components';

// https://medium.com/better-programming/how-to-build-a-drag-and-drop-grid-in-react-3008c5384b29

export const Grid = styled.div`
  width: ${props => props.width || '100%'};
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  background-color: ${props => props.backgroundColor || ''};
`;

export const GridImage = styled.div`
  flex-grow: 1;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: ${props => `url("${props.src}")`};
  background-size: cover;
  background-position: 50%;
`;

const GridItemWrapper = styled.div`
  flex: 0 0 ${props => `${100 / (props.numPerRow || 4)}%`};
  display: flex;
  justify-content: center;
  align-items: stretch;
  box-sizing: border-box;
  :before {
    content: '';
    display: table;
    padding-top: 100%;
  }
`;

export const GridItem = ({ forwardedRef, ...props }) => (
  <GridItemWrapper ref={forwardedRef} {...props} />
);
