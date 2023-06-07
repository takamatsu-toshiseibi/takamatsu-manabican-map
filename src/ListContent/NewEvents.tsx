import { useState } from 'react';
import { Feature } from 'geojson';
import { EventProps } from '../utils/types';
import formatDate from '../utils/formatDate';
import MarkerDetail from './MarkerDetail';

type Props = {
  events: Feature[];
  isPage: string | null;
  setIsPage: React.Dispatch<React.SetStateAction<string | null>>;
}

const Content = (props: Props) => {

  const { events, isPage, setIsPage } = props;
  const [eventDetail, setEventDetail] = useState<Feature[]>([]);

  const openDetailHandler = (feature: Feature) => {
    setEventDetail([feature]);
    setIsPage('progressEventDetail');
  }

  const progressEvents = events.filter((event) => {

    // @ts-ignore
    const properties: EventProps = event.properties;

    if (!properties.start_date || !properties.end_date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(properties.start_date);
    const endDate = new Date(properties.end_date);

    return (startDate <= today && today <= endDate);
  });

  return (
    <>
      {
        isPage === 'progressEventDetail' ? (
          <MarkerDetail events={eventDetail} />
        ) : (

          <div id="new-events">
            <div className="list-header">
              <i className="fa-sharp fa-solid fa-list"></i>
              <div className="title">イベントリスト</div>
            </div>
            {
              progressEvents && progressEvents.length > 0 ? (
                // @ts-ignore
                progressEvents.map((feature, index) => {

                  // @ts-ignore
                  const event: EventProps = feature.properties;
                  return (
                    <div className="list-section" key={index} onClick={() => openDetailHandler(feature)}>
                      {event.event_name && <div className="list-title">{event.event_name}</div>}
                      {event.category && <div className="list-sub-title">{event.category}</div>}
                      {(event.start_date && event.end_date) && <div className="list-period">{`${formatDate(event.start_date)}-${formatDate(event.end_date)}`}</div>}
                      <ul>
                        {
                          event.start_time && event.end_time && (
                            <li>
                              <img src="./img/time.svg" alt="time icon" />
                              <div>{`${event.start_time} ~ ${event.end_time}`}</div>
                            </li>
                          )
                        }
                        {
                          event.place_name && (
                            <li>
                              <img src="./img/place.svg" alt="place icon" />
                              <div>{event.place_name}</div>
                            </li>
                          )
                        }
                        {
                          event.access && (
                            <li>
                              <img src="./img/transport.svg" alt="transport icon" />
                              <div>{event.access}</div>
                            </li>
                          )
                        }
                        {
                          event.price_basic && event.target && (
                            <li>
                              <div className="icon-container"><img src="./img/price.svg" alt="price icon" />{event.price_basic}</div>
                              <div className="icon-container"><img src="./img/target.svg" alt="target icon" />{event.target}</div>
                            </li>
                          )
                        }
                      </ul>
                    </div>
                  )
                })
              ) : (
                <div className="list-section">
                  <div className="list-title">現在開催中のイベントはありません</div>
                </div>
              )
            }
          </div>
        )}
    </>
  );
}

export default Content;