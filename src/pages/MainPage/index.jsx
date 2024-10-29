import scss from "./MainPage.module.scss"
import * as Icons from "../../assets/icons/icons"
import { useEffect, useRef, useState } from "react"
import { IconButton, Button, Input } from "../../components"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../redux/slices/products"
import { fetchPayment } from "../../redux/slices/payment"

export const MainPage = () => {
  const dispatch = useDispatch()

  // Промокоды
  const [promocodes, setPromocodes] = useState([
    { name: "Hello", discount: 10 },
  ])

  const [isTelegram, setTelegram] = useState("")
  const [isPromocode, setPromocode] = useState("")
  const products = useSelector((state) => state.products.data)
  const [isVisible, setVisible] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2)
  }
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    }, {})
  }
  const handleSelectItem2 = (item) => {
    setSelectedItem2(item)
    setIsOpen2(false)
  }
  const [isProduct, setProduct] = useState([])
  const [selectedItem2, setSelectedItem2] = useState(null)
  const popupRef = useRef(null)
  const PopUP = (product) => {
    setVisible(true)
    setProduct(product)
    setSelectedItem2(product)
  }
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Отключение контекстного меню
    const handleContextMenu = (event) => {
      event.preventDefault()
    }

    // Отключение копирования
    const handleCopy = (event) => {
      event.preventDefault()
      alert("Копирование запрещено!")
    }

    // Отключение клавиши F12 и сочетания клавиш для инструментов разработчика
    const handleKeyDown = (event) => {
      // if (
      //   event.key === "F12" ||
      //   (event.ctrlKey && event.shiftKey && event.key === "I")
      // ) {
      //   event.preventDefault()
      //   event.stopPropagation()
      //   alert("F12 и инструменты разработчика запрещены!")
      // }
    }

    // Добавление обработчиков событий
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("copy", handleCopy)
    window.addEventListener("keydown", handleKeyDown)

    // Очистка обработчиков событий
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("copy", handleCopy)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  const tracks = [
    { title: "Гроза не грозила", src: "musik1.mp3" },
    { title: "Меллстрой", src: "musik2.mp3" },
  ]

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const visualRef = useRef(null)

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataArrayRef.current = dataArray

    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)
        const bass =
          dataArrayRef.current.slice(0, 5).reduce((a, b) => a + b, 0) / 5

        console.log("Bass level:", bass)

        if (visualRef.current) {
          visualRef.current.style.transform = `scale(${(bass * 1.5) / 300})`
        }

        if (isPlaying) {
          requestAnimationFrame(animate)
        } else {
          if (visualRef.current) {
            visualRef.current.style.transform = "scale(1)"
          }
        }
      }
    }

    animate()
    return () => {
      if (visualRef.current) {
        visualRef.current.style.transform = "scale(1)"
      }
    }
  }, [isPlaying])

  useEffect(() => {
    const audioElement = audioRef.current

    const updateCurrentTime = () => {
      setCurrentTime(audioElement.currentTime)
    }

    const updateDuration = () => {
      if (audioElement.duration) {
        setDuration(audioElement.duration)
      }
    }

    const handleCanPlayThrough = () => {
      if (isPlaying) {
        audioElement.play().catch((error) => {
          console.error("Ошибка воспроизведения:", error)
        })
      }
    }

    audioElement.addEventListener("timeupdate", updateCurrentTime)
    audioElement.addEventListener("loadedmetadata", updateDuration)
    audioElement.addEventListener("canplaythrough", handleCanPlayThrough)
    audioElement.addEventListener("ended", () => {
      setIsPlaying(false)
      if (visualRef.current) {
        visualRef.current.style.transform = "scale(1)"
      }
    })

    return () => {
      audioElement.removeEventListener("timeupdate", updateCurrentTime)
      audioElement.removeEventListener("loadedmetadata", updateDuration)
      audioElement.removeEventListener("canplaythrough", handleCanPlayThrough)
      audioElement.removeEventListener("ended", () => {
        setIsPlaying(false)
        if (visualRef.current) {
          visualRef.current.style.transform = "scale(1)"
        }
      })
    }
  }, [currentTrack, isPlaying])

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        if (audioContextRef.current) audioContextRef.current.suspend()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Ошибка воспроизведения:", error)
        })
        if (audioContextRef.current) audioContextRef.current.resume()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const changeTrack = async (next) => {
    setCurrentTrack(next)
    audioRef.current.src = tracks[next].src
    audioRef.current.load()

    // Дождитесь, пока трек будет загружен
    await new Promise((resolve) => {
      audioRef.current.oncanplay = () => resolve()
    })

    // Если трек был изначально включен, сразу начинаем воспроизведение
    if (isPlaying) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error("Ошибка воспроизведения:", error)
      }
    }
  }

  const nextTrack = async () => {
    const next = (currentTrack + 1) % tracks.length
    await changeTrack(next)
  }

  const prevTrack = async () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length
    await changeTrack(prev)
  }

  const seek = (event) => {
    if (duration > 0) {
      const width = event.target.clientWidth
      const clickX = event.nativeEvent.offsetX
      const newTime = (clickX / width) * duration
      audioRef.current.currentTime = newTime
    }
  }

  const [transformStyle, setTransformStyle] = useState({})

  const handleMouseMove = (event) => {
    const { clientX, clientY, currentTarget } = event
    const { width, height, left, top } = currentTarget.getBoundingClientRect()

    const offsetX = clientX - (left + width / 2)
    const offsetY = clientY - (top + height / 2)

    const intensity = 20
    const rotateX = (offsetY / height) * intensity
    const rotateY = (offsetX / width) * intensity

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    })
  }
  // Поиск и применение промокода
  const applyPromocode = (price) => {
    const foundPromocode = promocodes.find(
      (promo) => promo.name === isPromocode
    )
    if (foundPromocode) {
      const discountPrice = price - (price * foundPromocode.discount) / 100
      return discountPrice // Возвращаем цену с учетом скидки
    }
    return price // Если промокод не найден, возвращаем оригинальную цену
  }

  // Покупка товара с учетом промокода и Telegram
  const Buy = async (telegram, item) => {
    const discountedPrice = applyPromocode(item.price) // Применяем скидку к цене
    const params = {
      telegram,
      item: { ...item, price: discountedPrice }, // Передаем товар с новой ценой
    }
    try {
      dispatch(fetchPayment(params))
        .then((res) => {
          if (res.error) {
            console.log(res.error)
          } else {
            alert("Ожидайте ответа в Telegram в течение 24 часов.")
          }
        })
        .catch((error) => {
          alert("Ошибка при получении данных: " + error)
        })
    } catch (err) {
      alert("Error during authentication: " + err.message)
    }
  }

  return (
    <div>
      <div className={isVisible ? scss.authContainer : scss.hide}>
        <div
          ref={popupRef}
          className={`${scss.authForm} ${isVisible ? scss.visible : ""}`}
        >
          <div className={scss.form}>
            <ul className={scss.formButtons}>
              <span className={scss.orderTask}>
                <div className={scss.dropdown2}>
                  <button
                    className={scss.dropdownButton}
                    onClick={toggleDropdown2}
                  >
                    <div className={scss.dropdownL}>
                      <div className={scss.name}>
                        {selectedItem2?.name
                          ? selectedItem2?.name
                          : "Выберите товар"}
                      </div>
                    </div>
                    <span
                      className={`${scss.arrow} ${isOpen2 ? scss.open : ""}`}
                    ></span>
                  </button>
                  {isOpen2 && (
                    <div className={scss.dropdownContent}>
                      {isProduct.categories.map((category) => (
                        <div className={scss.dropdownProducts} key={category}>
                          <div
                            className={scss.dropdownProduct}
                            onClick={() => handleSelectItem2(category)}
                          >
                            <div className={scss.pName}>{category.name}</div>
                            <div className={scss.pPrice}>{category.price}₽</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={scss.block}>
                  Telegram
                  <Input
                    type="text"
                    text={isTelegram}
                    iconL="TG"
                    name="telegram"
                    className="input"
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </div>
                <div className={scss.block}>
                  Промокод
                  <Input
                    type="text"
                    text={isPromocode}
                    iconL="Star"
                    name="Promocode"
                    className="input"
                    onChange={(e) => setPromocode(e.target.value)}
                  />
                </div>
                {selectedItem2?.price ? (
                  <Button
                    iconL="Shops"
                    text={`${applyPromocode(selectedItem2?.price)}₽`} // Отображаем цену со скидкой
                    className="button-primary"
                    onClick={() => Buy(isTelegram, selectedItem2)}
                  />
                ) : null}
              </span>
            </ul>
          </div>
        </div>
        <div className={scss.authForm2}>
          <div className={scss.form}>
            <h2>Описание</h2>
            <h1>{selectedItem2?.description}</h1>
            {selectedItem2?.price != null && (
              <div>
                <h2>
                  Оплата по карте - {applyPromocode(selectedItem2?.price)}₽
                </h2>
                <h1>xxxx-xxxx-xxxx-xxxx Альфа-Банк</h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <img src="lines.svg" className="backImg1" />
      <img src="lines.svg" className="backImg2" />
      <div
        className={scss.container}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTransformStyle({})}
      >
        <div className={scss.middle}>
          <div className={scss.infoL}>
            <h1>Привет, я</h1>
            <h1>Ефим</h1>
            <h1>{`{ Алексеев }`}</h1>
            <div className={scss.buttons}>
              <IconButton
                attr="Orders"
                icon="Settings"
                onClick={() => {
                  handleIconClick("Orders")
                }}
                className={`icon icon-primary`}
                url="Orders"
              />
              <IconButton
                attr="Orders"
                icon="Settings"
                onClick={() => {
                  handleIconClick("Orders")
                }}
                className={`icon icon-primary`}
                url="Orders"
              />
              <IconButton
                attr="Orders"
                icon="Settings"
                onClick={() => {
                  handleIconClick("Orders")
                }}
                className={`icon icon-primary`}
                url="Orders"
              />
            </div>
            <img className={scss.mouse} src="Vector.png" />
          </div>
          <div ref={visualRef} className={scss.infoM}>
            <img
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTransformStyle({})}
              src="Group 1.png"
              style={{
                width: "100%",
                height: "100%",
                transition: "transform 0.1s ease-out",
                ...transformStyle,
              }}
            />
            <div></div>
          </div>

          <div className={scss.infoR}>
            <div className={scss.musik}>
              <h2 className={scss.name}>{tracks[currentTrack].title} </h2>
              <audio
                ref={audioRef}
                src={tracks[currentTrack].src}
                onTimeUpdate={() =>
                  setCurrentTime(audioRef.current.currentTime)
                }
              ></audio>
              <div className={scss.time}>
                {`${Math.floor(currentTime / 60)} м ${Math.floor(
                  currentTime % 60
                )} с`}
                <div
                  style={{
                    height: "10px",
                    width: "100%",
                    background: "#ccc",
                    position: "relative",
                  }}
                  onClick={seek}
                >
                  <div
                    style={{
                      width: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                      height: "100%",
                      background: "#3b82f6",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></div>
                </div>
                {`${Math.floor(duration / 60)} м ${Math.floor(
                  duration % 60
                )} с`}
              </div>

              <div className={scss.buttons}>
                <button onClick={prevTrack}>
                  <Icons.Post />
                </button>
                <button onClick={playPause}>
                  {isPlaying ? <Icons.Pause /> : <Icons.Go />}
                </button>
                <button onClick={nextTrack}>
                  <Icons.Next />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={scss.news}>
          {products.map((product, index) => {
            // Создаем массив букв алфавита
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            // Определяем класс на основе индекса, используя остаток деления для зацикливания
            const classLetter = alphabet[index % alphabet.length]

            return (
              <a
                onClick={() => PopUP(product)}
                href="#"
                key={product.name}
                style={{ background: product.color }}
                className={`${scss[classLetter]} ${scss.new}`} // добавляем класс с буквой
              >
                <div className={scss.img}>
                  <h1 className={scss.name}>{product.name}</h1>
                  <h1 className={scss.description}>{product.description}</h1>
                  {/* <img src={product.img} alt={product.img} /> */}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
