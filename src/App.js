import { useState, useRef, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyRoom from "./pages/MyRoom";
import Store from "./pages/Store";
import Game from "./pages/Game";
import Contest from "./pages/Contest";
import Layout from "./Layout";
import SelectPage from "./pages/Contest/SelectPage";
import ResultPage from "./pages/Contest/ResultPage";

function App() {
  // localStorage에서 hasChosen 값을 읽어와서 초기 상태를 설정
  const [hasChosen, setHasChosen] = useState(
    localStorage.getItem("hasChosen") === "true"
  );
  //====================== 게임 전용 변수 및 함수==========================
  const [Gold, setGold] = useState(1000);
  const [myPets, setMyPets] = useState([]); // 내가 갖고있는 동물
  const increaseValue = (increment) => {
    setGold(Gold + increment);
  };
  //====================== 게임 전용 변수 및 함수==========================

  //====================== 마이룸 전용 변수 및 함수==========================

  const [petlist, setpetList] = useState([
    {
      id: 1,
      img: function () {
        return this.attract < 80
          ? "/image/beetle/1.png"
          : this.attract < 100
          ? "/image/beetle/2.png"
          : "/image/beetle/3.png";
      },
      name: "빗흘",
      sort: "비틀",
      height: 0.25,
      weight: 0.1,
      age: 1,
      gold: 5,
      category: 'pet',
      feature: "고약한 악취",
      attract: 50,
      affect: 0,
      accessory: "",
    },
    {
      id: 2,
      img: function () {
        return this.attract < 80
          ? "/image/bird/1.png"
          : this.attract < 100
          ? "/image/bird/2.png"
          : "/image/bird/3.png";
      },
      name: "쇄",
      sort: "새",
      height: 20,
      weight: 7,
      age: 1,
      gold: 5,
      category: 'pet',
      feature: "하늘을 나는 동물",
      attract: 50,
      affect: 0,
      accessory: "",
    },
    {
      id: 3,
      img: function () {
        return this.attract < 80
          ? "/image/snake/1.png"
          : this.attract < 100
          ? "/image/snake/2.png"
          : "/image/snake/3.png";
      },
      name: "빼앰",
      sort: "뱀",
      height: 5,
      weight: 3,
      age: 1,
      gold: 5,
      category: 'pet',
      feature: "미끌거림",
      attract: 50,
      affect: 0,
      accessory: "",
    },
    {
      id: 4,
      img: function () {
        return this.attract < 90 ? "/image/frog/1.png" : "/image/frog/2.png";
      },
      name: "개굴이",
      sort: "개구리",
      height: 3,
      weight: 1,
      age: 1,
      gold: 125,
      category: 'pet',
      feature: "개구리 알 생성",
      attract: 60,
      affect: 0,
      accessory: "",
    },
    {
      id: 5,
      img: function () {
        return this.attract < 90 ? "/image/bat/1.png" : "/image/bat/2.png";
      },
      name: "Park쥐",
      sort: "박쥐",
      height: 7,
      weight: 3,
      age: 1,
      gold: 90,
      category: 'pet',
      feature: "구아노 생성",
      attract: 50,
      affect: 0,
      accessory: "",
    },
    {
      id: 6,
      img: function () {
        return "/image/goat.png";
      },
      name: "Goat",
      sort: "염소",
      height: 70,
      weight: 20,
      age: 1,
      gold: 75,
      category: 'pet',
      feature: "염소 털 생성",
      attract: 70,
      affect: 0,
      accessory: "",
    },
    {
      id: 7,
      img: function () {
        return "/image/snail.png";
      },
      name: "핑핑이",
      sort: "달팽이",
      height: 5,
      weight: 1,
      age: 1,
      gold: 35,
      category: 'pet',
      feature: "달팽이 크림 생성",
      attract: 50,
      affect: 0,
      accessory: "",
    },
    {
      id: 8,
      img: function () {
        return "/image/bee.png";
      },
      name: "B",
      sort: "꿀벌",
      height: 1,
      weight: 0.4,
      age: 1,
      gold: 55,
      category: 'pet',
      feature: "꿀 생성",
      attract: 50,
      affect: 0,
      accessory: "",
    },
  ]);

  // 동물 리스트 다음 ID
  const nextAnimalId = useRef(9);

  // 항목 추가
  const addItem = (item) => {
    setpetList([...petlist, item]);
    setMyPets(item.name); // 메인 페이지 -> 마이룸에도 추가
  };

  // 항목 삭제
  const removeItem = (itemId) => {
    setpetList(petlist.filter((item) => item.id !== itemId));
  };
  //====================== 마이룸 전용 변수 및 함수==========================

  //====================== 상점 전용 변수 및 함수==========================
  const [inventory, setInventory] = useState([]);
  const [purchasedPets, setPurchasedPets] = useState([]); // 산 동물은 제외
  const [select, setSelect] = useState(null);
  const nextId = useRef(1);

  const handleSelect = useCallback((ele) => {
    setSelect(ele);
  }, []);

  const handlePurchase = useCallback(
    (ele) => {
      if (select === null) {
        return;
      }
      if (Gold < ele.gold) {
        alert("골드가 부족합니다.");
      } else {
        const nextObject = {
          ...ele,
          id: nextId.current,
        };
        setMyPets((prevMyPets) => [...prevMyPets, ele.name]);
        setPurchasedPets(prev => [...prev, ele.name]); // 구매한 동물의 이름 추가
        setInventory((inventory) => inventory.concat(nextObject));
        nextId.current += 1;
        setGold((Gold) => Gold - ele.gold);
      }
      console.log(inventory);
      setSelect(null);
    },
    [Gold, inventory, select]
  );

  const handleSales = useCallback(
    (object) => {
      if (object === null) {
        return;
      }
      setInventory((inventory) =>
        inventory.filter((element) => element.id !== object.id)
      );
      console.log(inventory);
      setGold((Gold) => Gold + object.gold);
      setSelect(null);
    },
    [inventory]
  );
  //====================== 상점 전용 변수 및 함수==========================

  //====================== 콘테스트 전용 변수 및 함수==========================
  // 전체 펫 목록 중 내가 갖고 있는 펫만
  const ownedPetsList = petlist.filter(pet => myPets.includes(pet.name));
  //====================== 콘테스트 전용 변수 및 함수==========================

  useEffect(() => {
    // hasChosen 상태가 변경될 때 localStorage 값을 업데이트
    localStorage.setItem("hasChosen", hasChosen);
  }, [hasChosen]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {hasChosen ? (
          <Route path="/" element={<Navigate to="/myroom" />} />
        ) : (
          <Route
            index
            element={
              <MainPage
                hasChosen={hasChosen}
                setHasChosen={setHasChosen}
                petlist={petlist}
                addItem={addItem}
                nextAnimalId={nextAnimalId}
              />
            }
          />
        )}
        <Route
          path="/myroom"
          element={
            <MyRoom
              Gold={Gold}
              setGold={setGold}
              petlist={petlist}
              myPets={myPets}
              nextAnimalId={nextAnimalId}
              addItem={addItem}
              removeItem={removeItem}
              inventory={inventory}
              setInventory={setInventory}
              select={select}
            />
          }
        />
        <Route
          path="/store"
          element={
            <Store
              Gold={Gold}
              petlist={petlist}
              purchasedPets={purchasedPets}
              handlePurchase={handlePurchase}
              handleSales={handleSales}
              inventory={inventory}
              select={select}
              setSelect={setSelect}
              handleSelect={handleSelect}
            />
          }
        />
        <Route path="/game" element={<Game onIncrease={increaseValue} />} />
        <Route path="/contest" element={<Contest />} />
        <Route
          path="/contest/select"
          element={
            <SelectPage 
            petlist={ownedPetsList} 
            select={select} 
            setSelect={setSelect} />
          }
        />
        <Route path="/contest/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
