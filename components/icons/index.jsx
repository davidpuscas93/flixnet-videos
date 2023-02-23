const Like = ({ fill = 'white', selected = false }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill={fill}
    width='34px'
    height='34px'
  >
    <path d='M0 0h24v24H0V0zm0 0h24v24H0V0z' fill='none' />
    <path d='M21 12v-2h-9l1.34-5.34L9 9v10h9z' opacity={selected ? 1 : 0} />
    <path d='M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z' />
  </svg>
);

const Dislike = ({ fill = 'white', selected = false }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill={fill}
    width='34px'
    height='34px'
  >
    <path d='M3 12v2h9l-1.34 5.34L15 15V5H6z' opacity={selected ? 1 : 0} />
    <path d='M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4z' />
  </svg>
);

export { Like, Dislike };
