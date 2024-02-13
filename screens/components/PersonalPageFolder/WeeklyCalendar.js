import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { displayTitleByLocale } from './src/Locale';
import styles from './src/Style';
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo } from '@expo/vector-icons';

const WeeklyCalendar = ({ checkColor, checkEvent, ...props }) => {
    const [currDate, setCurrDate] = useState(moment(props.selected).locale(props.locale))
    const [weekdays, setWeekdays] = useState([])
    const [weekdayLabels, setWeekdayLabels] = useState([])
    const [selectedDate, setSelectedDate] = useState(currDate.clone())
    const [isCalendarReady, setCalendarReady] = useState(false)
    const [date, setDate] = useState(new Date());
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    useEffect(() => { // only first mount
        // When this is set to true, display calendar
        setCalendarReady(true)
        // Create Weekdays
        createWeekdays(currDate)
    }, [])

    const toggleModal = () => {
        // toggle the visibility of modal
        setIsModalVisible(!isModalVisible);
      }

    const createWeekdays = (date) => {
        //Array to save weekdays
        setWeekdays([])
        for (let i = 0; i < 7; i++) {
            // props.startWeekday value is 7
            // starting from the first day, set weekdayToAdd as each day of the week
            const weekdayToAdd = date.clone().weekday(props.startWeekday - 7 + i)
            // Update the setWeekdays array by adding weekdayToAdd
            setWeekdays(weekdays => [...weekdays, weekdayToAdd])
            // Label the days (Sun, Mon, Tue, ...)
            setWeekdayLabels(weekdayLabels => [...weekdayLabels, weekdayToAdd.format(props.weekdayFormat)])
        }
    }

    // If user presses back button
    const clickLastWeekHandler = () => {
        // Temporarily close calendar
        setCalendarReady(false)
        // save lastWeekDate to last week date
        const lastWeekCurrDate = currDate.subtract(7, 'days')
        // setCurrDate to lastWeekCurrDate
        setCurrDate(lastWeekCurrDate.clone())
        // SetSelectedDate to first day of the week from last week
        
        // create the weekdays for last week
        createWeekdays(lastWeekCurrDate.clone())
        // enable calendar again
        setCalendarReady(true)
    }

    // Same concept with last week clicker but this time is next week
    const clickNextWeekHandler = () => {
        setCalendarReady(false)
        const nextWeekCurrDate = currDate.add(7, 'days')
        setCurrDate(nextWeekCurrDate.clone())
        
        createWeekdays(nextWeekCurrDate.clone())
        setCalendarReady(true)
    }

    // set year, month, and day depending on users selection
    const isSelectedDate = date => {
        return (selectedDate.year() === date.year() && selectedDate.month() === date.month() && selectedDate.date() === date.date())
    }

    // if user presses on a day
    const onDayPress = (weekday, i) => {
        setSelectedDate(weekday.clone())
        if (props.onDayPress !== undefined) props.onDayPress(weekday.clone(), i)
    }

    const onChangeDate = ({type}, selectedDate) => {
        if(type === "set") {
            setDate(selectedDate);
        } else {
            toggleModal();
        }
    }

    const confirmDate = () => {
        setCurrDate(moment(date).locale(props.locale));
        createWeekdays(moment(date).locale(props.locale));
        console.log(currDate);
        toggleModal();
    }
    
    return (
        <View style={{marginTop: "15%", justifyContent: "center", alignItems: "center"}}>
            <View style={[styles.component, props.style]}>
                <View style={styles.header}>
                    {/* Display title and allow user to press it to change date */}
                    <TouchableOpacity style={{flexDirection: "row"}} onPress={toggleModal} >
                        <Text style={[styles.title, props.titleStyle]}>{isCalendarReady && displayTitleByLocale(props.locale, currDate, props.titleFormat)}</Text>
                        <Entypo name="chevron-small-down" size={30} color="black" style={{marginTop: "-6%"}} />
                    </TouchableOpacity>    
                    
                    {/* Moving to previous dates */}
                    <TouchableOpacity style={{...styles.arrowButton, position: "absolute", right: "10%"}} onPress={clickLastWeekHandler}>
                        <AntDesign name="left" size={20} color="black" />
                    </TouchableOpacity>
                    {/* Moving to future dates */}
                    <TouchableOpacity style={{...styles.arrowButton, position: "absolute", right: 0}} onPress={clickNextWeekHandler}>
                        <AntDesign name="right" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <Modal
                    onBackdropPress={() => setIsModalVisible(false)}
                    isVisible={isModalVisible}
                    swipeDirection="down"
                    onSwipeComplete={toggleModal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={200}
                    animationOutTiming={200}  
                    backdropTransitionInTiming={200} 
                    backdropTransitionOutTiming={0}
                    style={{justifyContent: "flex-end", margin: 0, flex: 1}}
                >
                        {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
                        <View style={s.modalContent}>
                            <View style={s.center} >
                                <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                                <TouchableOpacity onPress={toggleModal}>
                                    <Text style={{color: "grey", fontSize: 16, marginLeft: "3%"}}>취소</Text>
                                </TouchableOpacity>
                                    <View style={s.barIcon}></View>
                                    <TouchableOpacity onPress={confirmDate}>
                                        <Text style={{color: "#007AFF", fontSize: 16, marginRight: "3%"}}>완료</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* Choose date */}
                                <DateTimePicker 
                                    mode="date"
                                    display="spinner"
                                    value={date}
                                    style={styles.timePicker}
                                    onChange={onChangeDate}
                                    textColor='black'
                                />
                            </View>
                        </View>
                </Modal>
                {/* props allow a single component to be different values */}
                <View style={styles.week}>
                    {/* Days of the week label */}
                    <View style={styles.weekdayLabelContainer}>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[0] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[1] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[2] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[3] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[4] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[5] : ''}</Text>
                        </View>
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[6] : ''}</Text>
                        </View>
                    </View>
                    {/* Days of the week day numbers */}
                    <View style={styles.weekdayNumberContainer}>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[0], 0)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[0]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[0]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium", }}>
                                    {isCalendarReady ? weekdays[0].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && 
                                <View style={isSelectedDate(weekdays[0]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[0].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                            {/* Visuals for adding checks in weekly schedule */}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[1], 1)} >
                            <View style={isCalendarReady && isSelectedDate(weekdays[1]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[1]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[1].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && 
                                <View style={isSelectedDate(weekdays[1]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[1].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber}onPress={onDayPress.bind(this, weekdays[2], 2)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[2]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[2]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[2].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && 
                                <View style={isSelectedDate(weekdays[2]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[2].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[3], 3)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[3]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[3]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[3].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && 
                                <View style={isSelectedDate(weekdays[3]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[3].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[4], 4)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[4]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[4]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[4].date() : ''}
                                </Text>
                            </View>
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[4].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                                                        
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[5], 5)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[5]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[5]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[5].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && 
                                <View style={isSelectedDate(weekdays[5]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[5].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[6], 6)}>
                            <View style={isCalendarReady && isSelectedDate(weekdays[6]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                <Text style={isCalendarReady && isSelectedDate(weekdays[6]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[6].date() : ''}
                                </Text>
                            </View>
                            {/* {isCalendarReady && eventMap.get(weekdays[6].format('YYYY-MM-DD').toString()) !== undefined && 
                                <View style={isSelectedDate(weekdays[6]) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />
                            } */}
                            {isCalendarReady && checkEvent && checkEvent.get(weekdays[6].format('YYYY-MM-DD').toString()) !== undefined && checkColor && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "100%" }}>
                                    {checkColor.map(item => (
                                        <View key={item.id}>
                                            <Entypo name="check" size={13} color={item.checkColor} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )

};

WeeklyCalendar.propTypes = {
    /** initially selected day */
    selected: PropTypes.any,
    /** If firstDay = 1, week starts from Monday. If firstDay = 7, week starts from Sunday. */
    startWeekday: PropTypes.number,
    /** Set format to display title (e.g. titleFormat='MMM YYYY' displays "Jan 2020") */
    titleFormat: PropTypes.string,
    /** Set format to display weekdays (e.g. weekdayFormat='dd' displays "Mo" and weekdayFormat='ddd' displays "Mon") */
    weekdayFormat: PropTypes.string,
    /** Set locale (e.g. Korean='ko', English='en', Chinese(Mandarin)='zh-cn', etc.) */
    locale: PropTypes.string,
    /** Set list of events you want to display below weekly calendar. 
     * Default is empty array []. */
    onDayPress: PropTypes.func,
    /** Set theme color */
    themeColor: PropTypes.string,
    /** Set style of component */
    style: PropTypes.any,
    /** Set text style of calendar title */
    titleStyle: PropTypes.any,
    /** Set text style of weekday labels */
    dayLabelStyle: PropTypes.any
};

WeeklyCalendar.defaultProps = { // All props are optional
    selected: moment(),
    startWeekday: 7,
    titleFormat: undefined,
    weekdayFormat: 'ddd',
    locale: 'ko',
    onDayPress: undefined,
    themeColor: 'black',
    style: {},
    titleStyle: {},
    dayLabelStyle: {},
};

export default WeeklyCalendar;

const s = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: "20%", // This property determines the minimum height of the modal
        paddingBottom: 20,
      },
      center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      // color of bar on top of modal
      barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
      },
});