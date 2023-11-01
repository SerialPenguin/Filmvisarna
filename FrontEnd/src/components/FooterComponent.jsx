const FooterComponent = () => {
  return (
    <div style={{ padding: "1em", background: "#C699EA", color: "white" }}>
      <h3 style={{ textAlign: "center", color: "white" }}>Visste du att</h3>
      <p style={{ textAlign: "center" }}>
        Som medlem får du exklusiva erbjudanden
      </p>
      <form
        action=""
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".3em",
          background: "black",
          borderRadius: "8px",
          padding: "1em", 
        }}>
        <h3 style={{ textAlign: "center" }}>Bli Medlem</h3>
        <label htmlFor="">Förnamn</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder="John"
          style={{
            padding: ".6em",
            borderRadius: "8px",
            border: "none",
            background: "#704561",
            color: "#EED9FF",
          }}
        />
        <label htmlFor="">Efternamn</label>
        <input
          type="text"
          name="surname"
          id=""
          placeholder="Andersson"
          style={{
            padding: ".6em",
            borderRadius: "8px",
            border: "none",
            background: "#704561",
            color: "#EED9FF",
          }}
        />
        <label htmlFor="">E-postadress</label>
        <input
          type="mail"
          name="email"
          id=""
          placeholder="namn@exempel.se"
          style={{
            padding: ".6em",
            borderRadius: "8px",
            border: "none",
            background: "#704561",
            color: "#EED9FF",
          }}
        />
        <label htmlFor="">Lösenord</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder="John"
          style={{
            padding: ".6em",
            borderRadius: "8px",
            border: "none",
            background: "#704561",
            color: "#EED9FF",
          }}
        />

        <button style={{ marginTop: "2em", marginBottom: "2em"}}>Bli medlem</button>
      </form>
    </div>
  );
};

export default FooterComponent;
