import { useState } from "react";

const Lisayslomake = () => {
  const [suomi, setSuomi] = useState("");
  const [englanti, setEnglanti] = useState("");
  const [ilmoitus, setIlmoitus] = useState("");

  const lisaaSana = (event) => {
    event.preventDefault();
    setIlmoitus(""); // Nollaa aiemmat ilmoitukset

    fetch("http://localhost:3000/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fin: suomi, eng: englanti }),
    })
      .then(() => {
        // Tyhjennä kentät ja näytä ilmoitus, kun sana on lisätty onnistuneesti
        setSuomi("");
        setEnglanti("");
        setIlmoitus(`Sana "${suomi}" lisätty sanakirjaan.`);
      })
      .catch((err) => {
        setIlmoitus(`Virhe: ${err.message}`);
      });
  };

  return (
    <div>
      <h2>Lisäyslomake</h2>
      <form onSubmit={lisaaSana}>
        <input
          type="text"
          value={suomi}
          onChange={(e) => setSuomi(e.target.value)}
          placeholder="Suomenkielinen sana"
        />
        <input
          type="text"
          value={englanti}
          onChange={(e) => setEnglanti(e.target.value)}
          placeholder="Englanninkielinen vastine"
        />
        <button type="submit">Lisää</button>
      </form>
      {ilmoitus && <p>{ilmoitus}</p>}
    </div>
  );
};

export default Lisayslomake;
