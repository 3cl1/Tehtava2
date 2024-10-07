import { useState } from "react";

const Hakulomake = () => {
  const [suomi, setSuomi] = useState("");
  const [tulos, setTulos] = useState("");
  const [virhe, setVirhe] = useState("");

  const haeSana = (event) => {
    event.preventDefault();
    setVirhe(""); // Nollaa virheet ennen hakua

    fetch(`http://localhost:3000/words/fin/${suomi}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sanaa ${suomi} ei löydy`);
        }
        return response.json();
      })
      .then((data) => {
        setTulos(data.eng); // Tallentaa haetun englanninkielisen sanan tulos-muuttujaan
      })
      .catch((err) => {
        setVirhe(err.message); // Näyttää virheilmoituksen
      });
  };

  return (
    <div>
      <h2>Hakulomake</h2>
      <form onSubmit={haeSana}>
        <input
          type="text"
          value={suomi}
          onChange={(e) => setSuomi(e.target.value)}
          placeholder="Kirjoita sana suomeksi"
        />
        <button type="submit">Hae</button>
      </form>
      {tulos && <p>Englanniksi: {tulos}</p>}
      {virhe && <p style={{ color: "red" }}>{virhe}</p>}
    </div>
  );
};

export default Hakulomake;
