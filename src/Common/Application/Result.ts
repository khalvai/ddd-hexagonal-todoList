import Exception from 'src/Common/Domain/Exceptions/Exception';

type Result<V, E = Exception> = { ok: false; error: E } | { ok: true; value: V };

export default Result;
