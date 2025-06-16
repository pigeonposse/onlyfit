
import { Mp3Encoder } from '@breezystack/lamejs'

export type Wav2Mp3Options = { bitrate?: number }

const parseWavBuffer = ( wavBuffer: ArrayBuffer ) => {

	const dataView = new DataView( wavBuffer )
	let offset     = 0,
		audioFormat   = 0,
		numChannels   = 0,
		sampleRate    = 0,
		bitsPerSample = 0,
		dataOffset    = 0,
		dataChunkSize = 0

	if ( dataView.getUint32( offset, true ) !== 0x46464952 ) throw new Error( 'Not a RIFF file' )
	offset += 12

	while ( offset < wavBuffer.byteLength ) {

		const chunkId   = dataView.getUint32( offset, true )
		const chunkSize = dataView.getUint32( offset + 4, true )
		offset         += 8

		if ( chunkId === 0x20746d66 ) { // 'fmt ' chunk

			audioFormat   = dataView.getUint16( offset, true )
			numChannels   = dataView.getUint16( offset + 2, true )
			sampleRate    = dataView.getUint32( offset + 4, true )
			bitsPerSample = dataView.getUint16( offset + 14, true )
			offset       += chunkSize

		}
		else if ( chunkId === 0x61746164 ) { // 'data' chunk

			dataChunkSize = chunkSize
			dataOffset    = offset
			offset       += chunkSize
			break

		}
		else {

			offset += chunkSize

		}

	}

	if ( audioFormat !== 1 ) throw new Error( `Unsupported WAV audio format: ${audioFormat}. Only PCM (1) is supported.` )
	if ( bitsPerSample !== 16 ) throw new Error( `Unsupported WAV bits per sample: ${bitsPerSample}. Only 16-bit PCM is supported.` )
	if ( dataChunkSize === 0 ) throw new Error( 'No "data" chunk found in WAV file.' )

	const pcmData = new Int16Array( wavBuffer, dataOffset, dataChunkSize / 2 )

	return {
		sampleRate,
		numChannels,
		pcmData,
	}

}

export const wav2mp3 = async ( input: ArrayBuffer, opts?: Wav2Mp3Options ): Promise<ArrayBuffer> => {

	const {
		sampleRate, numChannels, pcmData,
	} = parseWavBuffer( input )
	const bitrate = opts?.bitrate || 128 // Bitrate por defecto a 128 kbps

	const encoder               = new Mp3Encoder( numChannels, sampleRate, bitrate )
	const mp3Data: Uint8Array[] = []

	const SAMPLES_PER_FRAME = 1152

	let leftChannel: Int16Array,
		rightChannel: Int16Array | null = null,
		offset = 0

	if ( numChannels === 2 ) {

		leftChannel  = new Int16Array( pcmData.length / 2 )
		rightChannel = new Int16Array( pcmData.length / 2 )
		for ( let i = 0, j = 0; i < pcmData.length; i += 2, j++ ) {

			leftChannel[j]  = pcmData[i]
			rightChannel[j] = pcmData[i + 1]

		}

	}
	else {

		leftChannel = pcmData

	}

	for ( let i = 0; i < leftChannel.length; i += SAMPLES_PER_FRAME ) {

		const leftChunk  = leftChannel.subarray( i, i + SAMPLES_PER_FRAME )
		const rightChunk = numChannels === 2 ? rightChannel!.subarray( i, i + SAMPLES_PER_FRAME ) : null

		const mp3buf = numChannels === 2
			? encoder.encodeBuffer( leftChunk, rightChunk! )
			: encoder.encodeBuffer( leftChunk )

		if ( mp3buf.length > 0 ) {

			mp3Data.push( mp3buf )

		}

	}

	const mp3buf = encoder.flush()
	if ( mp3buf.length > 0 ) {

		mp3Data.push( mp3buf )

	}

	const totalLength        = mp3Data.reduce( ( acc, val ) => acc + val.length, 0 )
	const finalMp3Uint8Array = new Uint8Array( totalLength )

	for ( const chunk of mp3Data ) {

		finalMp3Uint8Array.set( chunk, offset )
		offset += chunk.length

	}

	return finalMp3Uint8Array.buffer

}
