export function Destinations(searchInput) {
    console.log('searchInput.userSearchDestination', searchInput.userSearchDestination)

    if (!searchInput.userSearchDestination) {
        return (
            <div className="destination-container flex column">
                <div className="destination-header fs14 blacktxt bold">Search by region</div>
                <div className="regions grid">
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/pictures/f9ec8a23-ed44-420b-83e5-10ff1f071a13.jpg" /></div>
                        I'm flexible
                    </div>
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/im/pictures/66355b01-4695-4db9-b292-c149c46fb1ca.jpg?im_w=320" /></div>
                        Middle East
                    </div>
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/im/pictures/09be1400-6a42-4a4f-90f6-897e50110031.jpg?im_w=320" /></div>
                        Greece
                    </div>
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320" /></div>
                        United States
                    </div>
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/im/pictures/ea5598d7-2b07-4ed7-84da-d1eabd9f2714.jpg?im_w=320" /></div>
                        Italy
                    </div>
                    <div className="region-option flex column">
                        <div className="region-option-img"><img src="https://a0.muscache.com/im/pictures/d77de9f5-5318-4571-88c7-e97d2355d20a.jpg?im_w=320" /></div>
                        Southeast Asia
                    </div>
                </div>
            </div>
        )
    }
}
