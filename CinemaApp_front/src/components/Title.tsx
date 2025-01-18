import "../css/Title.css"

interface Props {
    display: string;
}

function Title({display}: Props) {
  return (
    <>
        <div className="action-title">
          <h1>{display}</h1>
          <hr className="action-line" />
        </div>
    </>
  )
}

export default Title