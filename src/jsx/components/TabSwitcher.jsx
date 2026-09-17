import './TabSwitcher.css';

const TabSwitcher = ({ tabs, activeIndex, onChange }) => (
  <div className="tab_switcher" role="tablist">
    {tabs.map((tab, index) => (
      <button aria-selected={index === activeIndex} className={`tab_switcher_btn${index === activeIndex ? ' tab_switcher_btn--active' : ''}`} key={tab.label} onClick={() => onChange(index)} role="tab" type="button">
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabSwitcher;
