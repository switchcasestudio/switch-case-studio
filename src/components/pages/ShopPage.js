import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import shop from '../../data/shop.json';
import '../../styles/components/shop.scss';

/**
 * /shop: things you can take home (themes, open-source tools) and time you
 * can book (office hours). Items live in src/data/shop.json. Static items (the Unhurried Pro
 * sales page is a plain HTML file in public/) use <a>, not <Link>, so the
 * router does a full page load instead of looking for a React route.
 */
const ItemLink = ({ item }) => {
  if (item.external) {
    return (
      <a className="shop-card__cta" href={item.url} target="_blank" rel="noopener noreferrer">
        {item.cta}
      </a>
    );
  }
  if (item.static) {
    return (
      <a className="shop-card__cta" href={item.url}>
        {item.cta}
      </a>
    );
  }
  return (
    <Link className="shop-card__cta" to={item.url}>
      {item.cta}
    </Link>
  );
};

const GROUPS = [
  { title: 'Themes', kind: 'WordPress theme', note: 'Built by the studio, released for everyone.' },
  { title: 'Open source', kind: 'Open source', note: 'Free software from the studio. Run it yourself.' },
  {
    title: 'Office hours',
    kind: 'Office hours',
    note: 'You bring the questions. We teach, you do the work.',
  },
];

const ShopPage = () => (
  <div className="shop">
    <Seo
      title="Shop | Switch Case Studio"
      description="WordPress themes and open-source tools by Switch Case Studio, and one-to-one office hours on SEO, design and code. Free student hours every month."
      path="/shop"
    />
    <header className="shop__head">
      <p className="shop__kicker">Shop</p>
      <h1>Things we made, and time we share.</h1>
      <p className="shop__lede">
        Themes and tools you can install today, and an hour with the studio when you want
        to learn how it is done.
      </p>
    </header>

    {GROUPS.map((group) => (
      <section className="shop__group" key={group.title} aria-labelledby={`shop-${group.kind}`}>
        <div className="shop__group-head">
          <h2 id={`shop-${group.kind}`}>{group.title}</h2>
          <p>{group.note}</p>
        </div>
        <ul className="shop__grid">
          {shop.items
            .filter((item) => item.kind === group.kind)
            .map((item) => (
              <li className={`shop-card ${item.image ? 'has-image' : ''}`} key={item.slug}>
                {item.image && (
                  <img
                    className="shop-card__image"
                    src={item.image}
                    alt=""
                    width="1600"
                    height="1080"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="shop-card__body">
                  <div className="shop-card__top">
                    <h3>{item.name}</h3>
                    <span className="shop-card__price">{item.price}</span>
                  </div>
                  <p>{item.blurb}</p>
                  <ItemLink item={item} />
                </div>
              </li>
            ))}
        </ul>
      </section>
    ))}
  </div>
);

export default ShopPage;
