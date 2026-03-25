"use client";

// Parantez içine page.js'den gelen kabloları (props) yazıyoruz
export default function ProfileSelector({ selectedProfile, setSelectedProfile }) {
  
  const profiles = [
    { id: "yigit", name: "Yigit", avatar: "/assets/avatar.jpg" },
    { id: "lamine", name: "Lamine", avatar: "/assets/avatar.jpg" },
    { id: "mert", name: "Mert", avatar: "/assets/avatar.jpg" },
    { id: "enes", name: "Enes", avatar: "/assets/avatar.jpg" },
    { id: "deneme1", name: "deneme1", avatar: "/assets/avatar.jpg" },
    { id: "denemeeeeeeeeeeee2", name: "denemeeeeeeeeeeee2", avatar: "/assets/avatar.jpg" },
  ];

  return (
    <div className="profile">
      {profiles.map((profile) => (
        <div 
          key={profile.id} 
          className={`${profile.id} ${selectedProfile === profile.name ? 'secili' : ''}`}
          onClick={() => setSelectedProfile(selectedProfile === profile.name ? null : profile.name)}
        >
          <img src={profile.avatar} alt={`${profile.name} Avatar`} />
          <p>{profile.name}</p>
        </div>
      ))}
    </div>
  );
}