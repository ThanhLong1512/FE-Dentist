import styled from "styled-components";
import { useState, useEffect } from "react";
import AvatarFullscreenModal from "../../components/AvatarFullscreenModal";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-weight: 600;
  font-size: 1.35rem;
  color: var(--color-grey-700);
  padding: 0.4rem 1rem 0.4rem 0.6rem;
  border-radius: var(--border-radius-full);
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.35);
  }
`;

const Avatar = styled.img`
  display: block;
  width: 3.4rem;
  height: 3.4rem;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--color-brand-500);
`;

const DefaultAvatar = styled.div`
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: var(--color-brand-gradient);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .name {
    max-width: 14rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RoleTag = styled.span`
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-brand-200);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

function UserAvatar() {
  const [userInfo, setUserInfo] = useState({
    name: "Quản trị viên",
    image: "",
    role: "admin",
    email: "",
  });
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        try {
          const parsed = JSON.parse(storedUserInfo);
          setUserInfo({
            name: parsed.name || "Quản trị viên",
            image: parsed.image || parsed.photo || "",
            role: parsed.role || "admin",
            email: parsed.email || "",
          });
          setImgError(false);
        } catch (error) {
          console.error("Lỗi khi parse UserInfo:", error);
        }
      }
    };

    loadUser();
    window.addEventListener("userInfoUpdated", loadUser);
    return () => window.removeEventListener("userInfoUpdated", loadUser);
  }, []);

  const initials = userInfo.name
    ? userInfo.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(-2)
    : "AD";

  const showImage = userInfo.image && !imgError;

  return (
    <>
      <StyledUserAvatar>
        <AvatarWrapper
          onClick={() => setShowModal(true)}
          title="Xem ảnh đại diện toàn màn hình"
        >
          {showImage ? (
            <Avatar
              src={userInfo.image}
              alt={`Avatar of ${userInfo.name}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <DefaultAvatar>{initials}</DefaultAvatar>
          )}
        </AvatarWrapper>
        <UserDetails>
          <span className="name">{userInfo.name}</span>
          <RoleTag>{userInfo.role === "admin" ? "Admin" : "Staff"}</RoleTag>
        </UserDetails>
      </StyledUserAvatar>

      <AvatarFullscreenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        src={showImage ? userInfo.image : ""}
        name={userInfo.name}
        role={userInfo.role === "admin" ? "Admin" : "Staff"}
        email={userInfo.email}
      />
    </>
  );
}

export default UserAvatar;
