import CalendarPicker from 'react-native-calendar-picker'

interface CalendarProps {
    handleDayChange: (day: string) => void;
    monthlyWorkouts: { date: string; monthWorkouts: string[]; }[];
    setSelectedMonth: (month: number) => void
  }

export default function Calendar({ handleDayChange, monthlyWorkouts, setSelectedMonth }: CalendarProps) {
    const monthNames = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']
    const dayNamesShort = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']

    const customDatesStyles: {date: string, style: {backgroundColor: string}, textStyle: {color: string}}[] = [];
  
    monthlyWorkouts.forEach(entry => {
        const hasCardio = entry.monthWorkouts.includes('Cardio');
        const hasKuntosali = entry.monthWorkouts.includes('Kuntosali');

        let backgroundColor = '#FFFFFF'; // Default background color

        if (hasCardio && hasKuntosali) {
        backgroundColor = '#e2afff'; // Purple for both Cardio and Kuntosali
        } else if (hasCardio) {
        backgroundColor = '#9ceaef'; // Blue for Cardio
        } else if (hasKuntosali) {
        backgroundColor = '#f4845f'; // Red for Kuntosali
        }

        customDatesStyles.push({
        date: entry.date,
        style: { backgroundColor },
        textStyle: { color: 'black' } // Text color can be set if needed
        });
    });

    const handleMonthChange = (date: string) => {
        const parsedDate = new Date(date)
        setSelectedMonth(parsedDate.getMonth() + 1)
    }

    return(
        <CalendarPicker
            onDateChange={(day) => handleDayChange(day.toString())}
            onMonthChange={(date) => handleMonthChange(date.toString())}
            selectedDayStyle={{borderColor: 'black', borderWidth: 3}}
            customDatesStyles={customDatesStyles}
            startFromMonday={true}
            weekdays={dayNamesShort}
            months={monthNames}
            previousTitle='Edellinen'
            nextTitle='Seuraava'
            selectMonthTitle='Valitse kuukausi vuodelta '
            selectYearTitle='Valitse vuosi'
      />
    )
}