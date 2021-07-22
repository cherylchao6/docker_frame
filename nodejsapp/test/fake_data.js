//data for insert mysql test schema
const mysqlHeroes = [
  [
    '1',
    'Daredevil',
    'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg',
    '2021-07-22'
  ],
  [
    '2',
    'Thor',
    'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg',
    '2021-07-22'
  ],
  [
    '3',
    'Iron Man',
    'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg',
    '2021-07-22'
  ],
  [
    '4',
    'Hulk',
    'http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg',
    '2021-07-22'
  ]
]


const mysqlProfiles = [
  [ '1', 2, 7, 9, 7, '2021-07-22' ],
  [ '2', 6, 4, 5, 9, '2021-07-22' ],
  [ '3', 6, 9, 6, 9, '2021-07-22' ],
  [ '4', 11, 0, 4, 2, '2021-07-22' ]  
];

//data for test response
const heroes = [
  {
    id: 1,
    name: 'Daredevil',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg'
  },
  {
    id: 2,
    name: 'Thor',
    image: 'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg'
  },
  {
    id: 3,
    name: 'Iron Man',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg'
  },
  {
    id: 4,
    name: 'Hulk',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg'
  }
];

const heroesWithProfile = [
  {
    id: 1,
    name: 'Daredevil',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg',
    profile: {
      str: 2,
      int: 7,
      agi: 9,
      luk: 7
    }
  },
  {
    id: 2,
    name: 'Thor',
    image: 'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg',
    profile: {
      str: 6,
      int: 4,
      agi: 5,
      luk: 9
    }
  },
  {
    id: 3,
    name: 'Iron Man',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg',
    profile:  {
      str: 6,
      int: 9,
      agi: 6,
      luk: 9
    }
  },
  {
    id: 4,
    name: 'Hulk',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg',
    profile: {
      str: 11,
      int: 0,
      agi: 4,
      luk: 2
    }
  }
]



module.exports = {
  mysqlHeroes,
  mysqlProfiles,
  heroes,
  heroesWithProfile
};
