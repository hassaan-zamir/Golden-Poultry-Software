import { ShedsMasterDataType } from "@/pages/home";
import axios from "axios";

interface PropTypes {
  sheds: ShedsMasterDataType[];
  shed_selected: string;
  houseNo: string;
  setHouseNo: React.Dispatch<React.SetStateAction<string>>;
  setSheds: React.Dispatch<React.SetStateAction<ShedsMasterDataType[]>>;
}

const Houses = ({
  sheds,
  shed_selected,
  houseNo,
  setHouseNo,
  setSheds,
}: PropTypes) => {
  let houses: string[] = [];
  const foundShed = sheds.find((shed) => shed.name == shed_selected);
  if (foundShed) {
    houses = foundShed.houses;
  }

  const addHouse = async () => {
    const house_no = prompt("Enter house_no : ");
    try {
      const resp = await axios.post("/api/addHouseNo", {
        house_no,
        shed_no: shed_selected,
      });
      if (resp) {
        setSheds(resp.data.sheds);
        alert("House added successfully");
      } else {
        alert("Could not add. Please try again");
      }
    } catch (e) {
      console.log("Error while adding new house", e);
      alert("Could not add. Please try again");
    }
  };

  return (
    <div className="form-group">
      <label>House No</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        {houses.length > 0 && houseNo!="" && (
          <select
            name="house_no"
            className="w-80"
            value={houseNo}
            onChange={(e) => {
              localStorage.setItem("house-no", e.target.value);
              setHouseNo(e.target.value);
            }}
            disabled={!foundShed}
          >
            {houses.map((house, i) => (
              <option key={i} value={house}>
                {house}
              </option>
            ))}
          </select>
        )}

        {foundShed && (
          <button className="add-btn" type="button" onClick={addHouse}>
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default Houses;
