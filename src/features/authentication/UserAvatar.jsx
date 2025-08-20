import styled from "styled-components";
import { useState, useEffect } from "react";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  height: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserAvatar() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        console.log(parsedUserInfo);
        setUserInfo({
          name: parsedUserInfo.name || "",
          image: parsedUserInfo.image || "",
        });
      } catch (error) {
        console.error("Lỗi khi parse UserInfo từ LocalStorage:", error);
      }
    }
  }, []);

  return (
    <StyledUserAvatar>
      <Avatar src={userInfo.image} alt={`Avatar of ${userInfo.name}`} />
      <span>{userInfo?.name}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
