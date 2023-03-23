import * as React from "react";
import axios from 'axios';
import { urlBuilder } from './util/util';
import Pagination from "./components/Pagination/Pagination";
import throttle from 'lodash.throttle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import './App.css';


function App() {
    const [repos, setRepos] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [query, setQuery] = React.useState("");
    const [lastPage, setLastPage] = React.useState(3);

    const searchRepositories = () => {
        if(query !== "") {
            axios.get(urlBuilder({ q: query, page: currentPage, per_page: 5 }))
            .then(({ data: { items, total_count } }) => {
                const pagesCount = Math.ceil(total_count/5);
                setLastPage(pagesCount);
                setRepos(items);
            }, error => {
                console.error(error);
            });
        }
    }

    const changeHandler = (event: any) => {
        if(event.target.value !== ""){
            setQuery(event.target.value);
        }
    };
    const throttleChangeHandler = React.useMemo(
        () => throttle(changeHandler, 3000)
        ,[]);

    React.useEffect(searchRepositories, [query,currentPage])    



    return (
        <>
            <header className={'repo-title-box'}><div><h3>Search Github Repositories</h3></div>
                 <input type="text" onChange={throttleChangeHandler} />
            </header>
            <ul className={'repo-list'}>
            {repos?.map((repo: any, i) => {
                const { language, git_url, stargazers_count, full_name, description, updated_at, topics, license } = repo;

                return (
                        <li key={full_name + i} className={'repo-list-item'}>
                            <div>
                                <a href={git_url} className={'repo-name'}>{full_name}</a>
                            </div>
                            <p className={'repo-description'}>{description}</p>
                            <div>
                                { topics.map( (t: string) => {
                                    return (<a key={t} href="{'github.com/topics/'+ {t}}" className="topic-tag">{t}</a>)
                                })
                                }
                            </div>
                            <div className={'repo-other'}>
                            {stargazers_count && <div className={'repo-other-item'}><span> <FontAwesomeIcon icon={faStar} className={'item-icon'} />{stargazers_count}</span></div> }
                            {language && <div className={'repo-other-item'}><span> <FontAwesomeIcon icon={faCircle} className={'item-icon'} />{language}</span></div> }
                            {license &&  <div className={'repo-other-item'}>{license?.name}</div> }
                            {updated_at && <div className={'repo-other-item'}>Updated at {moment(updated_at).fromNow()}</div>} 
                            </div>
                        </li>
                )
            })}
            {repos?.length > 0 && <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                maxLength={7}
                setCurrentPage={setCurrentPage}
            />}
            </ul>
        </>
    )
}

export default App;