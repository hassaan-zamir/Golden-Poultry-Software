import Link from "next/link";


const Box = ({ link, text }: { link: string; text: string }) => (
  <Link
    href={link}
    style={{
      width: '150px',
      height: '150px',
      display: 'flex',
      color: 'black',
      border: '1px solid #000',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '5px',
      textAlign: 'center',
      textDecoration: 'none',
    }}
  >
    {text}
  </Link>
);

const App = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      position: 'relative'
    }}
  >

    <div style={{ position: 'absolute', top: '5vh', color: '#000'}} >
      <h1>Golden Poultry</h1>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Box link="/home" text="Delivery Challan" />
        <Box link="/dsr" text="DSR" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Box link="/credit-report" text="Credit Report" />
        <Box link="/comission-report" text="Commision Report" />
        <Box link="/sales-register" text="Sales Register" />
      </div>
    </div>
  </div>
);

export default App;
