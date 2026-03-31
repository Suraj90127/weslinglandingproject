import img1 from "../assets/images/event_img/AAA.png";
import img2 from "../assets/images/event_img/NXT.png";
import img3 from "../assets/images/event_img/RAW.png";
import img4 from "../assets/images/event_img/Rey_De_Reyes.png";
import img5 from "../assets/images/event_img/roadblock.png";
import img6 from "https://cdn.historycollection.com/wp-content/uploads/2025/04/roman_reigns_rr24_2-745x1024.jpg";
import img7 from "../assets/images/event_img/WrestleMania.png";

const matches = [
  {
    id: 1,
    image1: img1,
    image2: img2,
    player1: "Roman Reigns",
    player2: "Kane",
    date: "Feb 13",
    day: "Friday",
    time: "7:30 PM",
  },
  {
    id: 2,
    image1: img3,
    image2: img4,
    player1: "Brock Lesnar",
    player2: "Bray Wyatt",
    date: "Feb 14",
    day: "Saturday",
    time: "7:30 PM",
  },
  {
    id: 3,
    image1: img5,
    image2: img6,
    player1: "Undertaker",
    player2: "John Cena",
    date: "Feb 16",
    day: "Monday",
    time: "6:30 PM",
  },
  {
    id: 4,
    image1: img2,
    image2: img4,
    player1: "Cody Rhodes",
    player2: "Seth Rollins",
    date: "Feb 20",
    day: "Friday",
    time: "7:30 PM",
  },
  {
    id: 5,
    image1: img4,
    image2: img1,
    player1: "Kevin Owens",
    player2: "The Rock",
    date: "Feb 23",
    day: "Monday",
    time: "7:30 PM",
  },
];

const upcoming = [
  {
    id: 1,
    image: img6,
    name: "Friday Night SmackDown",
    place: "Dallas, TX",
    time: "7:30 PM",
    date: "Feb 13",
    day: "Friday",
    arena: "American Airlines Center",
  },
  {
    id: 2,
    image: img4,
    name: "Road to WrestleMania",
    place: "Lubbock, TX",
    time: "7:30 PM",
    date: "Feb 14",
    day: "Saturday",
    arena: "United Supermarkets Arena",
  },
  {
    id: 3,
    image: img3,
    name: "Monday Night RAW",
    place: "Memphis, TN",
    time: "6:30 PM",
    date: "Feb 16",
    day: "Monday",
    arena: "FedEx Forum",
  },
  {
    id: 4,
    image: img6,
    name: "Friday Night SmackDown",
    place: "Fort Lauderdale, FL",
    time: "7:30 PM",
    date: "Feb 20",
    day: "Friday",
    arena: "Amerant Bank Arena",
  },
  {
    id: 5,
    image: img3,
    name: "Monday Night RAW",
    place: "Atlanta, GA",
    time: "7:30 PM",
    date: "Feb 23",
    day: "Monday",
    arena: "State Farm Arena",
  },
  {
    id: 6,
    image: img2,
    name: "NXT",
    place: "Atlanta, GA",
    time: "7:30 PM",
    date: "Feb 24",
    day: "Tuesday",
    arena: "Center Stage",
  },
];

export const details = {
  matches,
  upcoming,
};