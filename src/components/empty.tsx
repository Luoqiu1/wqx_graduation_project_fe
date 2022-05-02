import 'antd/dist/antd.css';
import './index.css';
import { Empty, Button } from 'antd';
import { Link } from 'umi';

function EmptyComponent(props) {
  return (
    <Empty description={<span>{props.desc}</span>}>
      <Button type="primary">
        <Link to={props.link}>现在去创建</Link>
      </Button>
    </Empty>
  );
}

export default EmptyComponent;
