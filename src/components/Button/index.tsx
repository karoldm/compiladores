import styled from "styled-components";

type TypeButton = {
  background: string;
}

const StyledButton = styled.button<TypeButton>`
  border: none;
  background: ${(props) => props.background};
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  padding: .5rem 1rem;

  &:hover {
    filter: brightness(0.8);
  }
`;

interface Props {
  onClick: () => void;
  title: string;
  background: string;
}

export const Button = ({onClick, title, background}: Props) => {
  return <StyledButton background={background} onClick={onClick}>{title}</StyledButton>
}