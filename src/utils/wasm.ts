import exec from '@univerjs-pro/exchange-wasm/wasm_exec?raw'
import init from '@univerjs-pro/exchange-wasm/exchange.wasm?init'

export async function injectWasm() {
  try {
    // eslint-disable-next-line no-new-func
    new Function(exec)()

    // @ts-expect-error
    const go = new window.Go()

    init(go.importObject).then((instance) => {
      go.run(instance)
    }).catch((err) => {
      console.error(err)
    })
  }
  catch (err) {
    console.error(err)
  }
}
