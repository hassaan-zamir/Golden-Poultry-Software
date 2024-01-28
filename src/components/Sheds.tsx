import { ShedsMasterDataType } from "@/pages/home";
import axios from "axios";


interface PropTypes {
  sheds: ShedsMasterDataType[];
  setSheds: React.Dispatch<React.SetStateAction<ShedsMasterDataType[]>>;
  shedNo: string;
  setShedNo: React.Dispatch<React.SetStateAction<string>>;
}

const Sheds = ({ sheds, shedNo, setShedNo, setSheds }: PropTypes) => {
  const addShed = async () => {
    const shed_name = prompt("Enter Shed Name : ");
    try {
      const resp = await axios.post("/api/addShed", {
        name: shed_name,
      });
      if (resp) {
        setSheds(resp.data.sheds);
        alert("Shed added successfully");
      } else {
        alert("Could not add. Please try again");
      }
    } catch (e) {
      console.log("Error while adding new shed", e);
      alert("Could not add. Please try again");
    }
  };

  return (
    <div className="form-group">
      <label>Shed No</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        {sheds.length > 0 && shedNo!="" && (
          <select
            name="shed_no"
            className="w-80"
            onChange={(e) => {
              localStorage.setItem("shed-no", e.target.value);
              setShedNo(e.target.value);
            }}
            defaultValue={shedNo}
          >
            {sheds.map((shed, i) => (
              <option key={i} value={shed.name}>
                {shed.name}
              </option>
            ))}
          </select>
        )}

        <button className="add-btn" type="button" onClick={addShed}>
          +
        </button>
      </div>
    </div>
  );
};

export default Sheds;
